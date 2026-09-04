"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import { serif } from "@/app/fonts";
import { profile } from "@/constant";

const SESSION_KEY = "preloader_shown_v1";
const MIN_VISIBLE_MS = 550;

const emptySubscribe = () => () => {};
const getClientSnapshot = () => {
  if (process.env.NODE_ENV === "development") return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) !== "true";
  } catch {
    return false;
  }
};
const getServerSnapshot = () => false;

export const PreLoader = () => {
  const shouldShow = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [done, setDone] = useState(false);
  const reduceMotion = useReducedMotion();

  const visible = shouldShow && !done;

  useEffect(() => {
    if (!visible) return;

    // Short, fixed cover, never blocks on `window.load` (fonts + WebGL can
    // stall that for seconds and would tank LCP).
    const timer = setTimeout(() => {
      setDone(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        /* noop */
      }
    }, MIN_VISIBLE_MS);

    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  const dy = reduceMotion ? 0 : 24;

  return (
    <AnimatePresence>
      <motion.div
        key="preloader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-background text-primary"
      >
        <motion.h1
          initial={{ opacity: 0, y: dy }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`${serif.className} flex items-center gap-[0.25em] text-5xl font-normal tracking-tight sm:text-7xl md:text-8xl`}
        >
          <span>{profile.name.first}</span>
          <span className="font-light text-primary/30">/</span>
          <span>{profile.name.last}</span>
        </motion.h1>
      </motion.div>
    </AnimatePresence>
  );
};
