import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { socials } from "./constant";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "you@example.com";
const RESUME_PATH = "/docs/resume.pdf";

// Content-Security-Policy. GA / Google Ads / Vercel are allow-listed because the
// analytics layer can load them after consent; everything else is same-origin.
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://va.vercel-scripts.com https://vercel.live https://challenges.cloudflare.com`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https://www.googletagmanager.com https://*.google-analytics.com https://*.googletagmanager.com https://avatars.githubusercontent.com`,
  `font-src 'self' data:`,
  `connect-src 'self' https://api.github.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.googletagmanager.com https://vitals.vercel-insights.com https://va.vercel-scripts.com https://challenges.cloudflare.com`,
  `frame-src 'self' https://vercel.live https://challenges.cloudflare.com`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    qualities: [75, 100],
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },

  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        source: "/docs/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow, max-snippet:-1" },
          { key: "Content-Disposition", value: "inline" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      {
        source: "/email",
        destination: `mailto:${CONTACT_EMAIL}`,
        permanent: true,
      },
      { source: "/direct-resume", destination: RESUME_PATH, permanent: true },
      ...socials.map((social) => ({
        source: `/${social.name.toLowerCase()}`,
        destination: social.url,
        permanent: true,
      })),
    ];
  },
};

export default withNextIntl(nextConfig);
