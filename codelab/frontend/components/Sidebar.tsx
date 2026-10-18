import { getTopics } from "@/lib/api";
import SidebarNav from "./SidebarNav";

const FALLBACK_TOPIC_LIST = [
  { slug: "python-basics", title: "Python Basics", summary: "Variables, I/O" },
  { slug: "control-flow", title: "Control Flow", summary: "Decisions & loops" },
  { slug: "strings", title: "Strings", summary: "Slicing & methods" },
  { slug: "functions-and-scope", title: "Functions & Scope", summary: "Modular code" },
  { slug: "lists-and-tuples", title: "Lists & Tuples", summary: "Sequences" },
  { slug: "dictionaries-and-sets", title: "Dictionaries & Sets", summary: "Hash mappings" },
];

export default async function Sidebar() {
  let topics: Awaited<ReturnType<typeof getTopics>> = [];
  try {
    topics = await getTopics();
  } catch {
    topics = FALLBACK_TOPIC_LIST;
  }

  return <SidebarNav topics={topics} />;
}
