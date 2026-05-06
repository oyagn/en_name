import { SYSTEM_PROMPT } from "@/lib/system-prompt";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    return new Response(
      JSON.stringify({ error: "API key not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-v4-flash",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      stream: true,
    }),
  });

  if (!response.ok) {
    return new Response(
      JSON.stringify({ error: `DeepSeek API error: ${response.status}` }),
      { status: response.status, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
