import type { LucideIcon } from "lucide-react";
import {
  Wrench,
  Tags,
  MemoryStick,
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
  { id: "noManual", icon: Wrench },
  { id: "mp3Tags", icon: Tags },
  { id: "cheatEngine", icon: MemoryStick },
  { id: "botsAndWeb", icon: Bot },
  { id: "university", icon: GraduationCap },
  { id: "fullStack", icon: Rocket, current: true },
  { id: "nextQuest", icon: Flag, nextQuest: true },
];
