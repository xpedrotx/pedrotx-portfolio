import type { LucideIcon } from "lucide-react";
import {
  Gamepad2,
  Server,
  Code2,
  Bot,
  GraduationCap,
  Rocket,
  Flag,
} from "lucide-react";

export interface JourneyStage {
  /** i18n key: journey.stages.<id>.{title,year,description,unlocked} */
  id: string;
  icon: LucideIcon;
  /** the stage the visitor is currently "standing on" */
  current?: boolean;
  /** an open-ended "next quest" marker rendered without a full card */
  nextQuest?: boolean;
}

export const journey: JourneyStage[] = [
  { id: "configWars", icon: Gamepad2 },
  { id: "homeServer", icon: Server },
  { id: "firstCode", icon: Code2 },
  { id: "botsAndWeb", icon: Bot },
  { id: "university", icon: GraduationCap },
  { id: "fullStack", icon: Rocket, current: true },
  { id: "nextQuest", icon: Flag, nextQuest: true },
];
