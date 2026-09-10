import { socials } from "./social";

export interface PageSeoConfig {
  title: string;
  description: string;
  keywords: string[];
  path: string;
  ogImage?: string;
  type?: "website" | "article" | "profile";
}

export interface ConstructMetadataOptions {
  title?: string;
  useTitleTemplate?: boolean;
  description?: string;
  keywords?: string[];
  image?: string | null;
  /** URL locale segment ("pt-br" | "en"); drives canonical + hreflang. */
  locale?: string;
  /** Path WITHOUT the locale prefix, e.g. "" or "/projects". */
  path?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  authors?: { name: string; url?: string }[];
  noIndex?: boolean;
}

const xSocial = socials.find((s) => s.name === "X");
const githubSocial = socials.find((s) => s.name === "GitHub");

function resolveSiteUrl() {
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
  return "https://pedrotx.com.br";
}

export const SITE_LAUNCH_YEAR = 2023;

export const SITE_SEO = {
  siteName: "PEDROTX",
  siteTitle: "PEDROTX | Desenvolvedor Full Stack",
  siteUrl: resolveSiteUrl(),
  titleTemplate: "%s | PEDROTX",
  defaultDescription:
    "Portfólio de Pedro Teixeira, desenvolvedor full-stack e estudante de Engenharia de Software no Paraná, apaixonado por games e por construir para a web com React, Next.js e Node.js.",
  defaultKeywords: [
    "Pedro Teixeira",
    "Pedro Teixeira portfólio",
    "desenvolvedor full-stack",
    "Full Stack Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript Developer",
    "Engenharia de Software",
    "desenvolvedor web Brasil",
    "Paraná developer",
  ],
  author: {
    name: "Pedro Teixeira",
    url: resolveSiteUrl(),
    email: "contato@pedrotx.com.br",
    handle: `@${githubSocial?.handle || "xpedrotx"}`,
  },
  creator: "Pedro Teixeira",
  publisher: "Pedro Teixeira",
  defaultOgImage: "/opengraph-image",
  twitterHandle: `@${xSocial?.handle || "xpedrotx"}`,
  socialLinks: socials.map((s) => s.url),
  locale: "pt_BR",
  themeColor: "#000000",
  robotsDefault: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
} as const;

export const PAGE_SEO: Record<
  "home" | "projects" | "resume" | "terms" | "privacy",
  PageSeoConfig
> = {
  home: {
    title: "PEDROTX | Desenvolvedor Full Stack",
    description:
      "Portfólio de Pedro Teixeira: projetos web full-stack, stack técnica e trajetória de um dev apaixonado por games e por programação.",
    keywords: [
      "Pedro Teixeira",
      "Pedro Teixeira portfólio",
      "desenvolvedor full-stack",
      "Next.js portfólio",
      "React developer",
    ],
    path: "",
    type: "website",
  },
  projects: {
    title: "Projetos",
    description:
      "Aplicações web, experimentos e repositórios open-source criados por Pedro Teixeira.",
    keywords: [
      "Pedro Teixeira projetos",
      "aplicações full-stack",
      "repositórios GitHub open source",
      "projetos Next.js",
      "projetos React",
      "portfólio de desenvolvedor",
    ],
    path: "/projects",
    type: "website",
  },
  resume: {
    title: "Currículo",
    description:
      "Solicite o currículo de Pedro Teixeira, desenvolvedor e estudante de Engenharia de Software. O PDF é enviado por email na hora.",
    keywords: [
      "Pedro Teixeira currículo",
      "Pedro Teixeira CV",
      "currículo desenvolvedor",
      "solicitar currículo",
      "currículo Full Stack Developer",
    ],
    path: "/resume",
    type: "website",
  },
  terms: {
    title: "Termos de Uso",
    description: "Termos de uso do portfólio de Pedro Teixeira.",
    keywords: ["termos de uso", "Pedro Teixeira"],
    path: "/terms",
    type: "website",
  },
  privacy: {
    title: "Política de Privacidade",
    description: "Como o portfólio de Pedro Teixeira trata dados pessoais.",
    keywords: ["política de privacidade", "LGPD", "Pedro Teixeira"],
    path: "/privacy",
    type: "website",
  },
};
