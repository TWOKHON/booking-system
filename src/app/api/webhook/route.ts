import { NextRequest, NextResponse } from 'next/server';

interface GitHubCommit {
  id: string;
  message: string;
  timestamp: string;
  url: string;
  author: {
    name: string;
    email: string;
  };
}

interface GitHubPushPayload {
  ref: string;
  commits: GitHubCommit[];
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: GitHubPushPayload = await req.json();
    const { commits, ref } = body;

    if (!commits || commits.length === 0) {
      return NextResponse.json({ ok: true, message: 'No commits found' }, { status: 200 });
    }

    const TRELLO_KEY   = process.env.TRELLO_KEY;
    const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
    const LIST_ID      = process.env.TRELLO_LIST_ID;

    if (!TRELLO_KEY || !TRELLO_TOKEN || !LIST_ID) {
      console.error('Missing Trello environment variables');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const branch = ref.replace('refs/heads/', '');

    for (const commit of commits) {
      const cardName = `[${commit.id.slice(0, 7)}] ${commit.message}`;
      const cardDesc = [
        `**Author:** ${commit.author.name}`,
        `**Branch:** ${branch}`,
        `**URL:** ${commit.url}`,
        `**Timestamp:** ${commit.timestamp}`,
      ].join('\n');

      const response = await fetch('https://api.trello.com/1/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idList: LIST_ID,
          key:    TRELLO_KEY,
          token:  TRELLO_TOKEN,
          name:   cardName,
          desc:   cardDesc,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`Failed to create Trello card for commit ${commit.id}:`, error);
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ message: 'Webhook endpoint is alive' }, { status: 200 });
}