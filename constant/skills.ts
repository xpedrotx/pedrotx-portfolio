import type { IconType } from "react-icons";

import {
  FaGitAlt,
  FaGithub,
  FaPython,
  FaReact,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaSquareJs,
  FaLinux,
  FaFigma,
  FaWindows,
  FaServer,
  FaMicrochip,
} from "react-icons/fa6";

import {
  SiExpress,
  SiNextdotjs,
  SiPostgresql,
  SiPrisma,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
  SiGooglegemini,
} from "react-icons/si";

import { VscVscode } from "react-icons/vsc";
import { OpenAiIcon } from "../components/icons/OpenAiIcon";

interface LogoProps {
  title: string;
  logoComponent: IconType;
  color?: string;
}

interface SkillsCategory {
  /** i18n key: skills.categories.<id> */
  id: string;
  data: LogoProps[];
}

export const skillsData: SkillsCategory[] = [
  {
    id: "languages",
    data: [
      { title: "JavaScript", logoComponent: FaSquareJs, color: "#F7DF1E" },
      { title: "TypeScript", logoComponent: SiTypescript, color: "#3178C6" },
      { title: "Python", logoComponent: FaPython, color: "#3776AB" },
      { title: "HTML5", logoComponent: FaHtml5, color: "#E34F26" },
      { title: "CSS3", logoComponent: FaCss3Alt, color: "#1572B6" },
      { title: "SQL", logoComponent: SiPostgresql, color: "#4169E1" },
    ],
  },
  {
    id: "frameworks",
    data: [
      { title: "React", logoComponent: FaReact, color: "#61DAFB" },
      { title: "Next.js", logoComponent: SiNextdotjs, color: "#000000" },
      { title: "Node.js", logoComponent: FaNodeJs, color: "#339933" },
      { title: "Express", logoComponent: SiExpress, color: "#000000" },
      { title: "Tailwind CSS", logoComponent: SiTailwindcss, color: "#06B6D4" },
      { title: "Prisma", logoComponent: SiPrisma, color: "#2D3748" },
    ],
  },
  {
    id: "tools",
    data: [
      { title: "Git", logoComponent: FaGitAlt, color: "#F05032" },
      { title: "GitHub", logoComponent: FaGithub, color: "#181717" },
      { title: "VS Code", logoComponent: VscVscode, color: "#007ACC" },
      { title: "Vite", logoComponent: SiVite, color: "#646CFF" },
      { title: "Figma", logoComponent: FaFigma, color: "#F24E1E" },
      { title: "Vercel", logoComponent: SiVercel, color: "#000000" },
      { title: "Linux", logoComponent: FaLinux, color: "#FCC624" },
      { title: "Windows", logoComponent: FaWindows, color: "#0078D6" },
      { title: "Windows Server", logoComponent: FaServer, color: "#00188F" },
      { title: "Hardware", logoComponent: FaMicrochip, color: "#6B7280" },
      { title: "ChatGPT", logoComponent: OpenAiIcon, color: "#10A37F" },
      { title: "Gemini", logoComponent: SiGooglegemini, color: "#4285F4" },
    ],
  },
];
