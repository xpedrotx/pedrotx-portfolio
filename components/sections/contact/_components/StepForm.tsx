"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Link } from "@/i18n/navigation";
import {
  CONTACT_LIMITS,
  validateContactField,
  type ContactField,
  type ContactData,
} from "@/lib/contact-validation";
import { useConsent } from "@/components/analytics/consent-context";
import { captureAttribution } from "@/lib/utm";
import { trackLead } from "@/lib/analytics";

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const FIELDS: ContactField[] = [
  "senderEmail",
  "senderName",
  "reasonToContact",
  "senderMsg",
];
const STEP_IDS = ["email", "name", "reason", "message"] as const;
const STEP_TYPES: Record<(typeof STEP_IDS)[number], string> = {
  email: "email",
  name: "text",
  reason: "text",
  message: "textarea",
};

export const StepForm = () => {
  const t = useTranslations("contact.form");
  const { consent } = useConsent();
  const turnstileRef = useRef<TurnstileInstance>(undefined);
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const submitLock = useRef(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ContactData>({
    senderEmail: "",
    senderName: "",
    reasonToContact: "",
    senderMsg: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (consent === "granted") captureAttribution();
  }, [consent]);

  const stepId = STEP_IDS[currentStep];
  const stepType = STEP_TYPES[stepId];

  const getCurrentValue = () => formData[FIELDS[currentStep]];

  const updateCurrentValue = (value: string) => {
    setError(null);
    setFormData((previous) => ({ ...previous, [FIELDS[currentStep]]: value }));
  };

  const validateStep = (): boolean => {
    const problem = validateContactField(
      FIELDS[currentStep],
      getCurrentValue(),
    );
    if (problem) {
      setError(t("errors." + problem));
      return false;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (currentStep < STEP_IDS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setError(null);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && stepType !== "textarea") {
      e.preventDefault();
      handleNext();
    }
  };

  const handleSubmit = async () => {
    if (submitLock.current || !validateStep()) return;
    if (TURNSTILE_KEY && !turnstileToken) {
      setError(t("errors.verification"));
      return;
    }
    submitLock.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          company: honeypotRef.current?.value ?? "",
          turnstileToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const codes = [
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
        throw new Error(
          t("errors." + (codes.includes(data.code) ? data.code : "generic")),
        );
      }

      trackLead();
      setIsSubmitted(true);
      toast.success(t("toast.successTitle"), {
        description: t("toast.successBody"),
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t("errors.generic");
      setError(errorMessage);
      toast.error(t("toast.errorTitle"), { description: errorMessage });
    } finally {
      submitLock.current = false;
      setTurnstileToken(null);
      turnstileRef.current?.reset();
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTurnstileToken(null);
    setFormData({
      senderEmail: "",
      senderName: "",
      reasonToContact: "",
      senderMsg: "",
    });
    setCurrentStep(0);
    setIsSubmitted(false);
    setError(null);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-start gap-2 py-4 text-left font-mono"
      >
        <p className="text-xs text-accent">{t("successBody")}</p>
        <button
          onClick={resetForm}
          className="mt-1 text-xs underline underline-offset-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        >
          {t("sendAnother")}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md flex flex-col gap-2">
      {/* Honeypot, hidden from users, catches naive bots */}
      <input
        ref={honeypotRef}
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground font-semibold mb-1">
        <span className="tracking-wider text-accent">
          {t(`steps.${stepId}`)}
        </span>
        {currentStep > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            disabled={isSubmitting}
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5 text-accent" />
            <span>{t("back")}</span>
          </button>
        )}
      </div>

      <div className="relative border-b border-border pb-2 focus-within:border-accent transition-colors">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            onAnimationComplete={() =>
              fieldRef.current?.focus({ preventScroll: true })
            }
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            {stepType === "textarea" ? (
              <textarea
                ref={(element) => {
                  fieldRef.current = element;
                }}
                id="contact-field"
                aria-label={t("labels." + stepId)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "contact-error" : undefined}
                maxLength={CONTACT_LIMITS[FIELDS[currentStep]]}
                value={getCurrentValue()}
                onChange={(e) => updateCurrentValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                placeholder={t(`placeholders.${stepId}`)}
                rows={2}
                disabled={isSubmitting}
                className="w-full bg-transparent font-mono text-base sm:text-lg text-primary placeholder:text-muted-foreground/60 outline-none resize-none"
              />
            ) : (
              <input
                ref={(element) => {
                  fieldRef.current = element;
                }}
                id="contact-field"
                aria-label={t("labels." + stepId)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "contact-error" : undefined}
                maxLength={CONTACT_LIMITS[FIELDS[currentStep]]}
                autoComplete={
                  stepId === "email"
                    ? "email"
                    : stepId === "name"
                      ? "name"
                      : "off"
                }
                type={stepType}
                value={getCurrentValue()}
                onChange={(e) => updateCurrentValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t(`placeholders.${stepId}`)}
                disabled={isSubmitting}
                className="w-full bg-transparent font-mono text-base sm:text-lg text-primary placeholder:text-muted-foreground/60 outline-none"
              />
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-accent hover:bg-muted/60 transition-all cursor-pointer disabled:opacity-50"
              title={
                currentStep === STEP_IDS.length - 1 ? t("send") : t("next")
              }
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin text-accent" />
              ) : (
                <ArrowRight className="size-4" />
              )}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {error && (
        <motion.div
          id="contact-error"
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 text-xs font-mono text-destructive mt-1"
        >
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {TURNSTILE_KEY && (
        <Turnstile
          ref={turnstileRef}
          siteKey={TURNSTILE_KEY}
          options={{
            size: "flexible",
            theme: resolvedTheme === "light" ? "light" : "dark",
          }}
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken(null)}
          onError={() => setTurnstileToken(null)}
          className="mt-2"
        />
      )}

      <p className="mt-2 font-mono text-[11px] text-muted-foreground">
        {t("privacyNotice")}{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-2 hover:text-primary transition-colors"
        >
          {t("privacyNoticeLink")}
        </Link>
        .
      </p>
    </div>
  );
};
