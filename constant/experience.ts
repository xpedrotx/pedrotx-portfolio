export interface ExperienceDate {
  dd: number;
  mm: string;
  yyyy: number;
}

export interface BaseExperience {
  /** i18n key: experience.items.<id> */
  id: string;
  role: string;
  startDate: ExperienceDate;
  description: string[];
  company: string;
  companySite: string;
  technologies: string[];
}

export type Experience =
  | (BaseExperience & { current: true })
  | (BaseExperience & { current?: false; endDate: ExperienceDate });

export const experience: Experience[] = [];
