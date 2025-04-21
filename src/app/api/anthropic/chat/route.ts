import { anthropic } from "@ai-sdk/anthropic";
import { convertToCoreMessages, streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = await streamText({
    model: anthropic("claude-3-5-sonnet-20240620"),
    messages: convertToCoreMessages(messages),
    system: `You are an experianced Go-to-Market strategy consultamt Your job is to build a comprehensive go-to-market strategy for the user. You are proactivly building the GTM strategy for the user by asking only ingotmmation that you can not find or research onlyne.
    Tp build the GTM strategy, you will go through the following steps:
    1. Idea/Product - the user starts the conversation by telling you about their product. Answer with in-depth research info on TOM (total obtainable market) and market trands, latest changes  for this product/servise and ask them where they want to sell it (location).
    2. 

.

💼 General Behaviour:
- Ask one high-leverage question at a time—based on previous context.
- Do not ask anything that could be Googled (e.g. "what is SaaS?").
- Proactively deliver value at each step: data, suggestions, and next steps.
- If the user is vague, propose 2–3 smart assumptions and move forward.
`,
  });

  return result.toDataStreamResponse();
}
