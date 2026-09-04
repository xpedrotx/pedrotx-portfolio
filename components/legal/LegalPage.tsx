import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Footer, Navbar } from "@/components/common";
import { Link } from "@/i18n/navigation";

interface LegalSection {
  heading: string;
  body: string;
}

interface LegalPageProps {
  namespace: "legal.terms" | "legal.privacy";
}

export async function LegalPage({ namespace }: LegalPageProps) {
  const t = await getTranslations(namespace);
  const tLegal = await getTranslations("legal");
  const sections = t.raw("sections") as LegalSection[];

  return (
    <div className="min-h-screen flex flex-col relative text-foreground">
      <Navbar />

      <div className="relative z-10 bg-background/70 backdrop-blur-md flex-1 flex flex-col w-full">
        <main className="flex-1 pt-24 sm:pt-28 pb-24 px-6 md:px-12 lg:px-20 max-w-3xl mx-auto w-full space-y-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-accent transition-colors group px-3.5 py-2 rounded-xl border border-card-border bg-card/85 backdrop-blur-xl hover:border-card-border-hover w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>{tLegal("back")}</span>
          </Link>

          <header className="space-y-3">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-primary">
              {t("title")}
            </h1>
            <p className="font-mono text-xs text-muted-foreground">
              {tLegal("updatedLabel")}: {t("updated")}
            </p>
            <p className="font-mono text-sm leading-relaxed text-muted-foreground max-w-2xl">
              {t("intro")}
            </p>
          </header>

          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.heading} className="space-y-2">
                <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-accent">
                  {section.heading}
                </h2>
                <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
