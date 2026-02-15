import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { provider, apiKey, model, system, message } = body as {
    provider: string;
    apiKey: string;
    model: string;
    system?: string;
    message: string;
  };

  if (!apiKey || !message || !provider || !model) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    if (provider === "anthropic") {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 4096,
          ...(system ? { system } : {}),
          messages: [{ role: "user", content: message }],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json(
          { error: data.error?.message || data.error?.type || JSON.stringify(data) },
          { status: res.status }
        );
      }
      return NextResponse.json({ content: data.content?.[0]?.text || "" });
    }

    if (provider === "openai") {
      const messages = [];
      if (system) messages.push({ role: "system", content: system });
      messages.push({ role: "user", content: message });

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model, max_tokens: 4096, messages }),
      });

      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json(
          { error: data.error?.message || JSON.stringify(data) },
          { status: res.status }
        );
      }
      return NextResponse.json({ content: data.choices?.[0]?.message?.content || "" });
    }

    if (provider === "google") {
      const requestBody: Record<string, unknown> = {
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: { maxOutputTokens: 4096 },
      };

      // Use systemInstruction for system prompts (proper Gemini API)
      if (system) {
        requestBody.systemInstruction = { parts: [{ text: system }] };
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg =
          data.error?.message ||
          data.error?.status ||
          (Array.isArray(data) && data[0]?.error?.message) ||
          JSON.stringify(data);
        return NextResponse.json({ error: errMsg }, { status: res.status });
      }

      const text =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join("") ||
        "";

      return NextResponse.json({ content: text });
    }

    return NextResponse.json({ error: `Unknown provider: ${provider}` }, { status: 400 });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "Unknown server error";
    console.error(`[api/test] ${provider} error:`, err);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
