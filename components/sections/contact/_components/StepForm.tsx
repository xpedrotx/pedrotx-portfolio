"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Turnstile } from "@marsidev/react-turnstile";
import { isValidEmail } from "@/lib/validators";
import { captureAttribution, getAttribution } from "@/lib/utm";
import { trackLead } from "@/lib/analytics";

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

interface FormData {
  senderEmail: string;
  senderName: string;
  reasonToContact: string;
  senderMsg: string;
}

const STEP_IDS = ["email", "name", "reason", "message"] as const;
const STEP_TYPES: Record<(typeof STEP_IDS)[number], string> = {
  email: "email",
  name: "text",
  reason: "text",
  message: "textarea",
};

export const StepForm = () => {
  const t = useTranslations("contact.form");
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
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
    captureAttribution();
  }, []);

  const stepId = STEP_IDS[currentStep];
  const stepType = STEP_TYPES[stepId];

  const getCurrentValue = () => {
    switch (currentStep) {
      case 0:
        return formData.senderEmail;
      case 1:
        return formData.senderName;
      case 2:
        return formData.reasonToContact;
      case 3:
        return formData.senderMsg;
      default:
        return "";
    }
  };

  const updateCurrentValue = (val: string) => {
    setError(null);
    setFormData((prev) => {
      switch (currentStep) {
        case 0:
          return { ...prev, senderEmail: val };
        case 1:
          return { ...prev, senderName: val };
        case 2:
          return { ...prev, reasonToContact: val };
        case 3:
          return { ...prev, senderMsg: val };
        default:
          return prev;
      }
    });
  };

  const validateStep = (): boolean => {
    const value = getCurrentValue().trim();
    if (!value) {
      setError(t("errors.required"));
      return false;
    }
    if (currentStep === 0 && !isValidEmail(value)) {
      setError(t("errors.email"));
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
    if (!validateStep()) return;
    if (TURNSTILE_KEY && !turnstileToken) {
      setError(t("errors.generic"));
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          company: honeypotRef.current?.value ?? "",
          attribution: getAttribution(),
          turnstileToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t("errors.generic"));
      }

      trackLead({ reason: formData.reasonToContact });
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
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
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
      {/* Honeypot — hidden from users, catches naive bots */}
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
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            {stepType === "textarea" ? (
              <textarea
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
    </div>
  );
};
