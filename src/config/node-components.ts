import { NodeType } from "./node-enums";
import type { NodeTypes } from "@xyflow/react";

import { InitialNode } from "@/components/custom/InitialNode";
import { HttpRequestNode } from "@/components/workflows/executions/components/http-request/node";
import { ManualTriggerNode } from "@/components/workflows/triggers/components/manual-trigger/node";
import { GoogleFormTrigger } from "@/components/workflows/triggers/components/google-form-trigger/node";
import { StripeTriggerNode } from "@/components/workflows/triggers/components/stripe-trigger/node";
import { GeminiNode } from "@/components/workflows/executions/components/gemini/node";
import { OpenAiNode } from "@/components/workflows/executions/components/openai/node";
import { AnthropicNode } from "@/components/workflows/executions/components/anthropic/node";
import { DiscordNode } from "@/components/workflows/executions/components/discord/node";
import { SlackNode } from "@/components/workflows/executions/components/slack/node";
import { FacebookNode } from "@/components/workflows/executions/components/facebook/node";
import { GoogleCalendarNode } from "@/components/workflows/executions/components/google-calendar/node";
import { TrelloNode } from "@/components/workflows/executions/components/trello/node";
import { InstagramNode } from "@/components/workflows/executions/components/instagram/node";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTrigger,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
  [NodeType.GEMINI]: GeminiNode,
  [NodeType.OPENAI]: OpenAiNode,
  [NodeType.ANTHROPIC]: AnthropicNode,
  [NodeType.DISCORD]: DiscordNode,
  [NodeType.SLACK]: SlackNode,
  [NodeType.FACEBOOK]: FacebookNode,
  [NodeType.GOOGLE_CALENDAR]: GoogleCalendarNode,
  [NodeType.TRELLO]: TrelloNode,
  [NodeType.INSTAGRAM]: InstagramNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
