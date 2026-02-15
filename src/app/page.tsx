import { allPrompts, categories } from "@/lib/prompts";
import PromptLibrary from "@/components/PromptLibrary";

export default function Home() {
  return <PromptLibrary prompts={allPrompts} categories={categories} />;
}
