import { execSync } from 'child_process';
import * as dotenv from 'dotenv';

dotenv.config();

interface CommitData {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  url: string;
}

const TRELLO_KEY   = process.env.TRELLO_KEY!;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN!;
const LIST_ID      = process.env.TRELLO_LIST_ID!;

// Change this to your GitHub repo URL
const REPO_URL = 'https://github.com/TWOKHON/booking-system/commit';

function getPastCommits(): CommitData[] {
  const log = execSync(
    'git log --pretty=format:"%H|%s|%an|%aI" --no-merges'
  ).toString().trim();

  return log.split('\n').map((line) => {
    const [id, message, author, timestamp] = line.split('|');
    return {
      id,
      message,
      author,
      timestamp,
      url: `${REPO_URL}/${id}`,
    };
  });
}

async function createTrelloCard(commit: CommitData): Promise<void> {
  const cardName = `[${commit.id.slice(0, 7)}] ${commit.message}`;
  const cardDesc = [
    `**Author:** ${commit.author}`,
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
    console.error(`❌ Failed: ${commit.message}`, error);
  } else {
    console.log(`✅ Created card: [${commit.id.slice(0, 7)}] ${commit.message}`);
  }
}

async function syncPastCommits(): Promise<void> {
  if (!TRELLO_KEY || !TRELLO_TOKEN || !LIST_ID) {
    console.error('❌ Missing environment variables. Check your .env file.');
    process.exit(1);
  }

  const commits = getPastCommits();
  console.log(`\n📦 Found ${commits.length} commits to sync...\n`);

  // Reverse so oldest commit becomes the first card (top to bottom order)
  const ordered = [...commits].reverse();

  for (const commit of ordered) {
    await createTrelloCard(commit);
    // Small delay to avoid hitting Trello API rate limits
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  console.log(`\n🎉 Done! ${commits.length} cards created in Trello.`);
}

syncPastCommits();