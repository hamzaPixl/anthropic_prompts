"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type { Prompt, Category } from "@/lib/types";
import { getCategoryCounts } from "@/lib/prompts";
import PromptModal from "./PromptModal";

export default function PromptLibrary({ prompts, categories }: { prompts: Prompt[]; categories: Category[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const counts = useMemo(() => getCategoryCounts(), []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return prompts.filter((p) => {
      if (activeCategory !== "all" && p.category !== activeCategory) return false;
      if (q && !p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q) && !p.categoryLabel.toLowerCase().includes(q) && !p.slug.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, activeCategory, prompts]);

  // Keyboard shortcut: / to focus search
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
      const active = document.activeElement;
      if (active?.tagName === "INPUT" || active?.tagName === "TEXTAREA") return;
      e.preventDefault();
      document.getElementById("search-input")?.focus();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 24px", width: "100%" }}>
        {/* Hero */}
        <div style={{ padding: "60px 0 40px" }}>
          <h1
            style={{
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--white)",
              fontFamily: "var(--sans)",
              marginBottom: 12,
            }}
          >
            Prompt Library
          </h1>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.5, fontFamily: "var(--sans)", maxWidth: 600 }}>
            {prompts.length} production-ready prompts. Browse, copy as Python or TypeScript, or test live with any provider.
          </p>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ position: "relative" }}>
            <svg
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#555"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="search-input"
              type="text"
              placeholder="Search prompts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 44px 10px 40px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text)",
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--border-hover)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
            <kbd
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 11,
                color: "var(--text-tertiary)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: "2px 6px",
                pointerEvents: "none",
              }}
            >
              /
            </kbd>
          </div>
        </div>

        {/* Section Header + Tabs */}
        <div style={{ marginBottom: 0 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              marginBottom: 16,
            }}
          >
            PROMPT LIBRARY
          </div>
          <div
            style={{
              display: "flex",
              gap: 24,
              borderBottom: "1px solid var(--border)",
              overflow: "auto",
            }}
          >
            <TabButton active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>
              All ({prompts.length})
            </TabButton>
            {categories.map((cat) => (
              <TabButton key={cat.key} active={activeCategory === cat.key} onClick={() => setActiveCategory(cat.key)}>
                {cat.label} ({counts[cat.key] || 0})
              </TabButton>
            ))}
          </div>
        </div>

        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "48px 1fr 200px 100px",
            padding: "12px 0",
            borderBottom: "1px solid var(--border)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
          }}
        >
          <span>#</span>
          <span>PROMPT</span>
          <span>CATEGORY</span>
          <span style={{ textAlign: "right" }}>TYPE</span>
        </div>

        {/* Rows */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ padding: "60px 0", textAlign: "center", color: "var(--text-secondary)" }}>
              No prompts match your search.
            </div>
          ) : (
            filtered.map((p, i) => (
              <PromptRow key={p.slug} prompt={p} index={i + 1} onClick={() => setSelectedPrompt(p)} />
            ))
          )}
        </div>

        {/* Data source note */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "20px 0",
            marginTop: 20,
            fontSize: 12,
            color: "var(--text-tertiary)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Showing {filtered.length} of {prompts.length} prompts</span>
          <span>Source: Anthropic Prompt Library</span>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          background: "#44b75e",
          padding: "16px 24px",
          marginTop: 40,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-color.svg" alt="Pixl" style={{ height: 16, filter: "brightness(0)" }} />
            <span style={{ fontSize: 13, color: "#000", fontWeight: 500, fontFamily: "var(--mono)" }}>
              Built by Pixl
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <a
              href="https://pixldev.be"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 13, color: "#000", fontWeight: 500, fontFamily: "var(--mono)", textDecoration: "none" }}
            >
              pixldev.be
            </a>
            <a
              href="https://www.linkedin.com/company/pixl-srl"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 13, color: "#000", fontWeight: 500, fontFamily: "var(--mono)", textDecoration: "none" }}
            >
              LinkedIn
            </a>
            <a
              href="mailto:hello@pixldev.be"
              style={{ fontSize: 13, color: "#000", fontWeight: 500, fontFamily: "var(--mono)", textDecoration: "none" }}
            >
              hello@pixldev.be
            </a>
            <a
              href="https://github.com/pixldev"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 13, color: "#000", fontWeight: 500, fontFamily: "var(--mono)", textDecoration: "none" }}
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {selectedPrompt && <PromptModal prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} />}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        borderBottom: active ? "2px solid var(--white)" : "2px solid transparent",
        color: active ? "var(--white)" : "var(--text-tertiary)",
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        padding: "8px 0",
        whiteSpace: "nowrap",
        transition: "color 0.15s, border-color 0.15s",
        fontFamily: "var(--mono)",
        marginBottom: -1,
      }}
    >
      {children}
    </button>
  );
}

function PromptRow({ prompt, index, onClick }: { prompt: Prompt; index: number; onClick: () => void }) {
  return (
    <div
      className="prompt-row"
      onClick={onClick}
      style={{
        display: "grid",
        gridTemplateColumns: "48px 1fr 200px 100px",
        padding: "14px 0",
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
        alignItems: "center",
      }}
    >
      <span style={{ color: "var(--text-tertiary)", fontSize: 13 }}>{index}</span>
      <div>
        <span style={{ fontWeight: 600, color: "var(--white)", fontSize: 14 }}>{prompt.title}</span>
        <span style={{ color: "var(--text-tertiary)", fontSize: 13, marginLeft: 10 }}>
          {prompt.slug}
        </span>
      </div>
      <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
        {prompt.categoryIcon} {prompt.categoryLabel}
      </span>
      <span
        style={{
          textAlign: "right",
          fontSize: 12,
          color: prompt.hasSystem ? "var(--text-secondary)" : "var(--text-tertiary)",
        }}
      >
        {prompt.hasSystem ? "System" : "User"}
      </span>
    </div>
  );
}
