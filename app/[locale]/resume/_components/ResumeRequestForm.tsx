"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { AlertCircle, Check, FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

import { Link } from "@/i18n/navigation";
import {
  RESUME_REQUEST_FIELDS,
  RESUME_REQUEST_LIMITS,
  validateResumeRequestField,
  type ResumeRequestData,
} from "@/lib/resume-request";

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const ERROR_CODES = [
  "required",
  "email",
  "tooLong",
  "invalid",
  "forbidden",
  "rateLimit",
  "unavailable",
  "verification",
  "delivery",
];

export function ResumeRequestForm() {
  const t = useTranslations("resume.form");
  const { resolvedTheme } = useTheme();
  const turnstileRef = useRef<TurnstileInstance>(undefined);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const submitLock = useRef(false);

  const [data, setData] = useState<ResumeRequestData>({
    requesterName: "",
    requesterEmail: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitLock.current) return;

    for (const field of RESUME_REQUEST_FIELDS) {
      const problem = validateResumeRequestField(field, data[field]);
      if (problem) {
        setError(t("errors." + problem));
        return;
      }
    }
    if (TURNSTILE_KEY && !token) {
      setError(t("errors.verification"));
      return;
    }

    submitLock.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/request-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          website: honeypotRef.current?.value ?? "",
          turnstileToken: token,
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(
          t(
            "errors." +
              (ERROR_CODES.includes(payload.code) ? payload.code : "generic"),
          ),
        );
      }
      setDone(true);
      toast.success(t("toast.successTitle"), {
        description: t("toast.successBody"),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : t("errors.generic");
      setError(message);
      toast.error(t("toast.errorTitle"), { description: message });
    } finally {
      submitLock.current = false;
      setToken(null);
      turnstileRef.current?.reset();
      setIsSubmitting(false);
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md rounded-2xl border border-accent/30 bg-accent/5 p-6 font-mono"
      >
        <div className="flex items-center gap-2 text-accent">
          <Check className="size-4" />
          <span className="text-sm font-semibold">{t("successTitle")}</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {t("successBody", { email: data.requesterEmail })}
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="flex max-w-md flex-col gap-4">
      <input
        ref={honeypotRef}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        data-1p-ignore="true"
        data-lpignore="true"
        data-form-type="other"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {t("nameLabel")}
        </span>
        <input
          value={data.requesterName}
          onChange={(e) => {
            setError(null);
            setData((p) => ({ ...p, requesterName: e.target.value }));
          }}
          maxLength={RESUME_REQUEST_LIMITS.requesterName}
          autoComplete="name"
          disabled={isSubmitting}
          placeholder={t("namePlaceholder")}
          className="rounded-xl border border-border bg-card/60 px-4 py-2.5 font-mono text-sm text-foreground outline-none transition-colors focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {t("emailLabel")}
        </span>
        <input
          type="email"
          value={data.requesterEmail}
          onChange={(e) => {
            setError(null);
            setData((p) => ({ ...p, requesterEmail: e.target.value }));
          }}
          maxLength={RESUME_REQUEST_LIMITS.requesterEmail}
          autoComplete="email"
          disabled={isSubmitting}
          placeholder={t("emailPlaceholder")}
          className="rounded-xl border border-border bg-card/60 px-4 py-2.5 font-mono text-sm text-foreground outline-none transition-colors focus:border-accent"
        />
      </label>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-1.5 font-mono text-xs text-destructive"
        >
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {TURNSTILE_KEY && (
        <Turnstile
          ref={turnstileRef}
          siteKey={TURNSTILE_KEY}
          options={{
            size: "flexible",
            theme: resolvedTheme === "light" ? "light" : "dark",
          }}
          onSuccess={setToken}
          onExpire={() => setToken(null)}
          onError={() => setToken(null)}
        />
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-accent-foreground transition-all hover:bg-accent/90 disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <FileDown className="size-4" />
        )}
        {t("submit")}
      </button>

      <p className="font-mono text-[11px] text-muted-foreground">
        {t("privacyNotice")}{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-2 hover:text-primary transition-colors"
        >
          {t("privacyNoticeLink")}
        </Link>
        .
      </p>
    </form>
  );
}
