import { NextResponse } from "next/server";
import { profile } from "@/constant/profile";
import { selected_works, works } from "@/constant/projects";
import { skillsData } from "@/constant/skills";
import { socials } from "@/constant/social";
import { SITE_SEO, PAGE_SEO } from "@/constant/seo";
import en from "@/messages/en.json";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const baseUrl = SITE_SEO.siteUrl;
  const about = en.about;
  const projectItems = en.projects.items as Record<string, string>;

  let content = `# ${profile.name.full} — ${profile.work.title}\n\n`;
  content += `> ${SITE_SEO.defaultDescription}\n\n`;

  content += `## Summary\n`;
  content += `- **Full Name**: ${profile.name.full}\n`;
  content += `- **Role**: ${profile.work.title}\n`;
  content += `- **Email**: ${profile.email}\n`;
  content += `- **Location**: ${profile.curr_location.city}, ${profile.curr_location.state}, ${profile.curr_location.country}\n`;
  content += `- **Education**: ${about.education.degree}, ${profile.education.uni} (${about.education.batch})\n`;
  content += `- **Portfolio**: ${baseUrl}\n`;
  content += `- **Quote**: "${about.quote}"\n\n`;

  content += `## About\n`;
  content += `${about.brief}\n\n`;
  about.paragraphs.forEach((p) => {
    content += `- ${p}\n`;
  });
  content += `\n`;

  content += `## Technical Skills\n\n`;
  skillsData.forEach((category) => {
    const label =
      (en.skills.categories as Record<string, string>)[category.id] ??
      category.id;
    content += `### ${label}\n`;
    content += `- ${category.data.map((i) => i.title).join(", ")}\n\n`;
  });

  content += `## Projects\n\n`;
  [...selected_works, ...works].forEach((project) => {
    const live = project.links.live ? ` | [Live](${project.links.live})` : "";
    const gh = project.links.github ? ` | [Code](${project.links.github})` : "";
    content += `- **${project.name}**${live}${gh}\n`;
    content += `  - ${projectItems[project.id] ?? ""}\n`;
    content += `  - Tech: ${project.technologies.join(", ")}\n`;
  });
  content += `\n`;

  content += `## Social Profiles\n`;
  socials.forEach((s) => {
    content += `- [${s.name}](${s.url}): @${s.handle}\n`;
  });
  content += `\n`;

  content += `## Site Navigation\n`;
  content += `- [Home](${baseUrl}${PAGE_SEO.home.path}): ${PAGE_SEO.home.description}\n`;
  content += `- [Projects](${baseUrl}${PAGE_SEO.projects.path}): ${PAGE_SEO.projects.description}\n`;
  content += `- [Resume](${baseUrl}${PAGE_SEO.resume.path}): ${PAGE_SEO.resume.description}\n`;
  content += `- [Sitemap](${baseUrl}/sitemap.xml)\n`;
  content += `- [Robots.txt](${baseUrl}/robots.txt)\n`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
