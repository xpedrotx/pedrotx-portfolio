import {
  Geist,
  Geist_Mono,
  Newsreader,
  Space_Grotesk,
} from "next/font/google";
import localFont from "next/font/local";

export const main = Geist({
  variable: "--font-main",
  subsets: ["latin"],
});

// Display serif — used for the big name (hero, footer), preloader and 404.
export const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

// Section headings / display sans.
export const heading = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const signature = localFont({
  src: [
    {
      path: "../assets/fonts/bastliga-one.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-signature",
  display: "swap",
});
