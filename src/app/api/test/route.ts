import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { provider, apiKey, model, system, message } = await req.json();

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
      if (!res.ok) return NextResponse.json({ error: data.error?.message || JSON.stringify(data) }, { status: res.status });
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
      if (!res.ok) return NextResponse.json({ error: data.error?.message || JSON.stringify(data) }, { status: res.status });
      return NextResponse.json({ content: data.choices?.[0]?.message?.content || "" });
    }

    if (provider === "google") {
      const contents = [];
      if (system) {
        contents.push({ role: "user", parts: [{ text: `System: ${system}\n\n${message}` }] });
      } else {
        contents.push({ role: "user", parts: [{ text: message }] });
      }
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: { maxOutputTokens: 4096 },
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) return NextResponse.json({ error: data.error?.message || JSON.stringify(data) }, { status: res.status });
      return NextResponse.json({ content: data.candidates?.[0]?.content?.parts?.[0]?.text || "" });
    }

    return NextResponse.json({ error: `Unknown provider: ${provider}` }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
