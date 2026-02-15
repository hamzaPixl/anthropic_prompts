export interface Prompt {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  categoryIcon: string;
  source: string;
  file: string;
  hasSystem: boolean;
  system: string;
  userExample: string;
  inputSchema: {
    label: string;
    type: "text" | "textarea" | "code";
    placeholder: string;
  };
}

export interface Category {
  key: string;
  label: string;
  icon: string;
  file: string;
}

export type Provider = "anthropic" | "openai" | "google";

export interface TestRequest {
  provider: Provider;
  apiKey: string;
  model: string;
  system?: string;
  message: string;
}

export interface TestResponse {
  content?: string;
  error?: string;
}
