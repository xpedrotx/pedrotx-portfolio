export interface Project {
  /** i18n key: projects.items.<id> */
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
    id: "glicai",
    name: "GlicAI",
    technologies: ["Python", "TypeScript", "PostgreSQL", "Docker", "WhatsApp API"],
    links: {},
  },
  {
    id: "drageovana",
    name: "Dra. Geovana Roque",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    links: {
      live: "https://drageovana.com",
    },
  },
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
    name: "Portfólio v1",
    technologies: ["HTML", "CSS", "JavaScript"],
    links: {
      github: "https://github.com/xpedrotx/xpedrotx.github.io",
      live: "https://xpedrotx.github.io",
    },
  },
];

export const works: Project[] = [
  {
    id: "wedding",
    name: "Wedding",
    technologies: ["HTML", "CSS", "JavaScript"],
    links: {
      github: "https://github.com/xpedrotx/wedding",
    },
  },
];
