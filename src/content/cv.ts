export interface Experience {
  org: string;
  role: string;
  period: string;
  points: string[];
}

export interface CvData {
  summary: string;
  experience: Experience[];
  skills: string[];
  leadership: Experience[];
}

export const cv: CvData = {
  summary:
    "computer science student and software engineer interested in low-level programming, electronics, and practical systems. currently learning rust and contributing to rust-clippy.",
  experience: [
    {
      org: "tejas ai (yc w25)",
      role: "founding engineer",
      period: "aug 2025 - feb 2026",
      points: [
        "contributed to early system architecture decisions, implementing ci, code quality practices, and environment setup for full-stack development across typescript and python.",
        "designed and implemented a whatsapp ai chatbot system integrating ai sensy, python backend services, and render.com cron jobs to deliver automated job alerts.",
        "built backend pipelines to fetch job data from the google serp api, including request batching, error handling, rate-limiting, and structured response parsing.",
        "integrated user preference data and built backend logic to generate personalised job recommendations.",
      ],
    },
    {
      org: "google summer of code - society for arts and technology",
      role: "student contributor",
      period: "may 2025 - sep 2025",
      points: [
        "designed and implemented a modular media library management system in modern c++ with clear separation between core library logic and application layer.",
        "developed an asynchronous directory scanning engine to index large media libraries efficiently, optimising file system traversal and i/o performance.",
        "built a json-over-websocket ipc layer enabling real-time communication between the server and multiple clients with extensible request/response protocols.",
        "established cross-platform build automation and ci/cd pipelines using cmake and github actions for reliable multi-os support.",
      ],
    },
  ],
  skills: [
    "rust",
    "codex",
    "claude code",
    "python",
    "c++20",
    "c",
    "html/css",
    "javascript",
    "sql",
    "neovim",
    "vs code",
    "git",
    "tmux",
    "cmake",
    "bash",
    "arch linux",
    "github",
    "gitlab",
    "pygame-ce",
  ],
  leadership: [
    {
      org: "gdg on campus",
      role: "organiser",
      period: "aug 2026 - present",
      points: [
        "building the campus's first non-hierarchical tech club, bringing in students passionate about tech and organising events for students all across the country.",
      ],
    },
    {
      org: "girlscript summer of code",
      role: "mentor",
      period: "jul 2025 - aug 2025",
      points: [
        "contributed to an inclusive and collaborative open-source community, empowering beginners from diverse backgrounds to make meaningful contributions.",
        "mentored a cohort of open-source contributors through technical guidance, code reviews, and constructive feedback.",
      ],
    },
  ],
};
