import type { Prompt, Category } from "./types";

import categoriesMeta from "../../data/categories.json";
import coding from "../../data/coding.json";
import writing from "../../data/writing.json";
import creativity from "../../data/creativity.json";
import dataAndAnalysis from "../../data/data-and-analysis.json";
import business from "../../data/business.json";
import education from "../../data/education.json";
import philosophyAndEthics from "../../data/philosophy-and-ethics.json";
import lifestyleAndWellness from "../../data/lifestyle-and-wellness.json";
import language from "../../data/language.json";
import safety from "../../data/safety.json";

export const categories: Category[] = categoriesMeta as Category[];

export const allPrompts: Prompt[] = [
  ...(coding as Prompt[]),
  ...(writing as Prompt[]),
  ...(creativity as Prompt[]),
  ...(dataAndAnalysis as Prompt[]),
  ...(business as Prompt[]),
  ...(education as Prompt[]),
  ...(philosophyAndEthics as Prompt[]),
  ...(lifestyleAndWellness as Prompt[]),
  ...(language as Prompt[]),
  ...(safety as Prompt[]),
];

export function getPromptsByCategory(key: string): Prompt[] {
  return allPrompts.filter((p) => p.category === key);
}

export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  allPrompts.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  return counts;
}

export const PROVIDER_MODELS: Record<string, { label: string; models: { id: string; label: string }[] }> = {
  anthropic: {
    label: "Anthropic",
    models: [
      { id: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
      { id: "claude-haiku-4-20250414", label: "Claude Haiku 4" },
    ],
  },
  openai: {
    label: "OpenAI",
    models: [
      { id: "gpt-4o", label: "GPT-4o" },
      { id: "gpt-4o-mini", label: "GPT-4o Mini" },
    ],
  },
  google: {
    label: "Google",
    models: [
      { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
      { id: "gemini-2.5-pro-preview-05-06", label: "Gemini 2.5 Pro" },
    ],
  },
};
