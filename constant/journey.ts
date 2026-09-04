import type { LucideIcon } from "lucide-react";
import {
  Wrench,
  Tags,
  MemoryStick,
  Server,
  HardDrive,
  Code2,
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
  { id: "linuxAndServers", icon: Server },
  { id: "firstItJobs", icon: HardDrive },
  { id: "devAndIt", icon: Code2, current: true },
  { id: "nextStep", icon: Flag, nextQuest: true },
];
