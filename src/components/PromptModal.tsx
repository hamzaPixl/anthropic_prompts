"use client";

import { useState, useEffect } from "react";
import type { Prompt, Provider, TestResponse } from "@/lib/types";
import { PROVIDER_MODELS } from "@/lib/prompts";

export default function PromptModal({ prompt, onClose }: { prompt: Prompt; onClose: () => void }) {
  const [userInput, setUserInput] = useState(prompt.userExample);
  const [toast, setToast] = useState("");

  // Test panel state
  const [showTest, setShowTest] = useState(false);
  const [provider, setProvider] = useState<Provider>("anthropic");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(PROVIDER_MODELS.anthropic.models[0].id);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<TestResponse | null>(null);

  useEffect(() => {
    setModel(PROVIDER_MODELS[provider].models[0].id);
  }, [provider]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const copyPython = () => {
    let code = 'import anthropic\n\nclient = anthropic.Anthropic()\n\nmessage = client.messages.create(\n    model="claude-sonnet-4-20250514",\n    max_tokens=4096,\n';
    if (prompt.hasSystem) code += "    system=" + JSON.stringify(prompt.system) + ",\n";
    code += '    messages=[\n        {"role": "user", "content": ' + JSON.stringify(userInput) + "}\n    ],\n)\nprint(message.content[0].text)";
    navigator.clipboard.writeText(code);
    flash("Copied Python");
  };

  const copyTypeScript = () => {
    let code = 'import Anthropic from "@anthropic-ai/sdk";\n\nconst client = new Anthropic();\n\nasync function main() {\n  const message = await client.messages.create({\n    model: "claude-sonnet-4-20250514",\n    max_tokens: 4096,\n';
    if (prompt.hasSystem) code += "    system: " + JSON.stringify(prompt.system) + ",\n";
    code += '    messages: [\n      { role: "user", content: ' + JSON.stringify(userInput) + " }\n    ],\n  });\n\n  console.log(message.content[0].text);\n}\n\nmain();";
    navigator.clipboard.writeText(code);
    flash("Copied TypeScript");
  };

  const copyPrompt = () => {
    let text = "";
    if (prompt.hasSystem) text += "[System]\n" + prompt.system + "\n\n";
    text += "[User]\n" + userInput;
    navigator.clipboard.writeText(text);
    flash("Copied prompt text");
  };

  const runTest = async () => {
    if (!apiKey.trim()) {
      flash("Enter an API key first");
      return;
    }
    setTesting(true);
    setResult(null);
    try {
      const res = await fetch("/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey: apiKey.trim(),
          model,
          system: prompt.hasSystem ? prompt.system : undefined,
          message: userInput,
        }),
      });
      const data: TestResponse = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Network error" });
    } finally {
      setTesting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fade-in"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(8px)",
          zIndex: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "48px 20px",
          overflowY: "auto",
        }}
      >
        {/* Modal */}
        <div
          style={{
            background: "#000",
            border: "1px solid var(--border)",
            borderRadius: 12,
            width: "100%",
            maxWidth: 720,
            position: "relative",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-tertiary)",
              fontSize: 13,
              cursor: "pointer",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
            }}
          >
            &times;
          </button>

          {/* Header */}
          <div style={{ padding: "24px 28px 16px", borderBottom: "1px solid var(--border)" }}>
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--text-tertiary)",
                marginBottom: 6,
              }}
            >
              {prompt.categoryIcon} {prompt.categoryLabel}
            </div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "var(--white)",
                marginBottom: 6,
                fontFamily: "var(--sans)",
              }}
            >
              {prompt.title}
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 10, lineHeight: 1.5 }}>
              {prompt.description}
            </p>
            <a
              href={prompt.source}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "var(--text-tertiary)",
                fontSize: 12,
                borderBottom: "1px solid var(--border)",
                paddingBottom: 1,
              }}
            >
              View on Anthropic Docs &rarr;
            </a>
          </div>

          {/* Body */}
          <div style={{ padding: "20px 28px 28px" }}>
            {/* System prompt */}
            <SectionLabel>System Prompt</SectionLabel>
            {prompt.hasSystem ? (
              <pre
                className="prompt-block"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: 14,
                  marginBottom: 20,
                  fontSize: 12,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  maxHeight: 180,
                  overflowY: "auto",
                  color: "var(--text-secondary)",
                }}
              >
                {prompt.system}
              </pre>
            ) : (
              <div
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: 14,
                  marginBottom: 20,
                  fontSize: 12,
                  color: "var(--text-tertiary)",
                  fontStyle: "italic",
                }}
              >
                None — this prompt uses only a user message
              </div>
            )}

            {/* User input */}
            <SectionLabel>{prompt.inputSchema.label || "User Input"}</SectionLabel>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={prompt.inputSchema.placeholder || ""}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text)",
                fontSize: 13,
                resize: "vertical",
                outline: "none",
                minHeight: 100,
                transition: "border-color 0.15s",
                marginBottom: 20,
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--border-hover)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              <ActionBtn onClick={copyPython}>Copy Python</ActionBtn>
              <ActionBtn onClick={copyTypeScript}>Copy TypeScript</ActionBtn>
              <ActionBtn onClick={copyPrompt}>Copy Prompt</ActionBtn>
              <ActionBtn onClick={() => setUserInput(prompt.userExample)} muted>
                reset
              </ActionBtn>
            </div>

            {/* Test Section */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
              <button
                onClick={() => setShowTest(!showTest)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "var(--mono)",
                }}
              >
                <span style={{ color: "var(--text-tertiary)", fontSize: 11 }}>
                  {showTest ? "▾" : "▸"}
                </span>
                TEST WITH API KEY
              </button>

              {showTest && (
                <div style={{ marginTop: 16 }}>
                  {/* Provider tabs */}
                  <div style={{ display: "flex", gap: 16, marginBottom: 12, borderBottom: "1px solid var(--border)" }}>
                    {(Object.keys(PROVIDER_MODELS) as Provider[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => setProvider(p)}
                        style={{
                          background: "none",
                          border: "none",
                          borderBottom: provider === p ? "2px solid var(--white)" : "2px solid transparent",
                          color: provider === p ? "var(--white)" : "var(--text-tertiary)",
                          fontSize: 12,
                          fontWeight: provider === p ? 600 : 400,
                          cursor: "pointer",
                          padding: "6px 0",
                          fontFamily: "var(--mono)",
                          marginBottom: -1,
                        }}
                      >
                        {PROVIDER_MODELS[p].label}
                      </button>
                    ))}
                  </div>

                  {/* Model select */}
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      background: "#000",
                      color: "var(--text)",
                      fontSize: 12,
                      marginBottom: 8,
                      outline: "none",
                    }}
                  >
                    {PROVIDER_MODELS[provider].models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label} ({m.id})
                      </option>
                    ))}
                  </select>

                  {/* API key */}
                  <input
                    type="password"
                    placeholder={`${PROVIDER_MODELS[provider].label} API key...`}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      background: "transparent",
                      color: "var(--text)",
                      fontSize: 12,
                      marginBottom: 12,
                      outline: "none",
                    }}
                  />

                  <button
                    onClick={runTest}
                    disabled={testing}
                    style={{
                      padding: "8px 20px",
                      borderRadius: 6,
                      border: "1px solid var(--white)",
                      background: testing ? "transparent" : "var(--white)",
                      color: testing ? "var(--text-tertiary)" : "#000",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: testing ? "not-allowed" : "pointer",
                      fontFamily: "var(--mono)",
                      transition: "all 0.15s",
                    }}
                  >
                    {testing ? "running..." : "Run"}
                  </button>

                  {/* Result */}
                  {result && (
                    <div style={{ marginTop: 16 }}>
                      {result.error ? (
                        <div
                          style={{
                            border: "1px solid rgba(239,68,68,0.3)",
                            borderRadius: 8,
                            padding: 14,
                            fontSize: 12,
                            color: "var(--red)",
                          }}
                        >
                          {result.error}
                        </div>
                      ) : (
                        <pre
                          className="prompt-block"
                          style={{
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            padding: 14,
                            fontSize: 12,
                            lineHeight: 1.6,
                            whiteSpace: "pre-wrap",
                            maxHeight: 400,
                            overflowY: "auto",
                            color: "var(--text)",
                          }}
                        >
                          {result.content}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="toast"
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--white)",
            color: "#000",
            padding: "10px 20px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            zIndex: 300,
            fontFamily: "var(--mono)",
          }}
        >
          {toast}
        </div>
      )}
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "var(--text-tertiary)",
        marginBottom: 8,
        fontWeight: 500,
      }}
    >
      {children}
    </div>
  );
}

function ActionBtn({ children, onClick, muted }: { children: React.ReactNode; onClick: () => void; muted?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 16px",
        borderRadius: 6,
        border: "1px solid var(--border)",
        background: "transparent",
        color: muted ? "var(--text-tertiary)" : "var(--text)",
        fontSize: 13,
        cursor: "pointer",
        transition: "all 0.15s",
        fontFamily: "var(--mono)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-hover)";
        e.currentTarget.style.color = "var(--white)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.color = muted ? "var(--text-tertiary)" : "var(--text)";
      }}
    >
      {children}
    </button>
  );
}
