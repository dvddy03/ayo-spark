import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  console.warn("ANTHROPIC_API_KEY is not defined.");
}

export const anthropic = new Anthropic({
  apiKey,
});

