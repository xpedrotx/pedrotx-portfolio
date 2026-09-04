import { ImageResponse } from "next/og";
import { SITE_SEO } from "@/constant/seo";

export const alt = "PEDROTX, Desenvolvedor Full Stack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0a0a0a",
          padding: "90px",
          position: "relative",
        }}
      >
        {/* red mark, top-right */}
        <div
          style={{
            position: "absolute",
            top: 84,
            right: 96,
            display: "flex",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 34,
              height: 74,
              background: "#ff2d2d",
              transform: "skewX(-20deg)",
            }}
          />
          <div
            style={{
              width: 34,
              height: 74,
              background: "#ff2d2d",
              transform: "skewX(-20deg)",
              opacity: 0.55,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 132,
            fontWeight: 800,
            color: "#fafafa",
            letterSpacing: -2,
          }}
        >
          PEDROTX
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 16,
            width: 220,
            height: 8,
            background: "#ff2d2d",
            borderRadius: 4,
          }}
        />

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 44,
            color: "#a1a1aa",
          }}
        >
          Desenvolvedor Full Stack
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 70,
            left: 90,
            display: "flex",
            fontSize: 28,
            color: "#ff2d2d",
          }}
        >
          {SITE_SEO.siteUrl.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    { ...size },
  );
}
