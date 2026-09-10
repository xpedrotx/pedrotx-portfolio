"use client";

import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Footer, Navbar } from "@/components/common";
import { ResumeRequestForm } from "./ResumeRequestForm";

export default function ResumeClient() {
  const t = useTranslations("resume");

  return (
    <div className="min-h-screen flex flex-col relative text-foreground">
      <Navbar />

      <div className="relative z-10 bg-background/70 backdrop-blur-md flex-1 flex flex-col w-full">
        <main className="flex-1 pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-accent transition-colors group px-3.5 py-2 rounded-xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-sm hover:border-accent/40"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>{t("back")}</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="font-mono text-2xl sm:text-3xl font-bold text-foreground">
              {t("title")}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-lg">
              {t("requestIntro")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <ResumeRequestForm />
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
