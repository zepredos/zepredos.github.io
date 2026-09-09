export type ProjectStatus = "active" | "completed" | "experimental" | "archived";

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  status: ProjectStatus;
  date?: string;
  sourceUrl?: string;
  writeup?: string;
}

export const projects: Project[] = [
  {
    id: "mini-library-content-manager",
    title: "mini library content manager",
    description:
      "a concurrent media-library management prototype with real-time directory monitoring and multi-threaded file scanning.",
    technologies: ["c++", "sqlite", "taglib", "oop", "concurrency"],
    status: "completed",
    sourceUrl: "https://github.com/zepredos/sat-gsoc-2025-projects/tree/main/minilibrarycontentmanager",
    writeup:
      "extracts audio and video metadata with taglib, stores deduplicated records in sqlite using insert or replace, and provides a cli for inspecting metadata, querying the database, and managing user-defined tags.",
  },
  {
    id: "vampire-shooter",
    title: "vampire shooter",
    description:
      "a tile-based 2d top-down shooter with real-time controls, enemy ai, collision detection, and shooting mechanics.",
    technologies: ["python", "pygame", "pytmx", "oop", "game dev", "event-driven", "gui"],
    status: "completed",
    sourceUrl: "https://github.com/zepredos/Vampire-Shooter",
    writeup:
      "parses tmx map layers for world generation and object placement, then combines custom sprite classes, layered rendering, camera offsets, animation, physics, timed enemy spawning, audio feedback, cooldown logic, and sprite collision masks.",
  },
];

export function getProject(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}
