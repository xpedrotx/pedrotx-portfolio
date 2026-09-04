export interface Project {
  /** i18n key: projects.items.<id>.description */
  id: string;
  name: string;
  technologies: string[];
  links: {
    live?: string;
    github?: string;
  };
}

export const selected_works: Project[] = [
  {
    id: "finaribot",
    name: "FinariBot",
    technologies: ["JavaScript", "Node.js", "Discord.js"],
    links: {
      github: "https://github.com/xpedrotx/FinariBot",
    },
  },
  {
    id: "portfolio",
    name: "Portfolio",
    technologies: ["HTML", "CSS", "JavaScript"],
    links: {
      github: "https://github.com/xpedrotx/xpedrotx.github.io",
      live: "https://xpedrotx.github.io",
    },
  },
  {
    id: "wedding",
    name: "Wedding",
    technologies: ["HTML", "CSS", "JavaScript"],
    links: {
      github: "https://github.com/xpedrotx/wedding",
    },
  },
];

export const works: Project[] = [
  {
    id: "taskflow",
    name: "TaskFlow",
    technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    links: {},
  },
  {
    id: "devlog",
    name: "DevLog",
    technologies: ["React", "Vite", "Tailwind CSS", "Supabase"],
    links: {},
  },
];
