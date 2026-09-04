import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Pedro Teixeira ("pedrotx") mark, red on near-black, matching the site logo.
const MARK = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -61.5 940 940">
  <defs>
    <clipPath id="a"><path d="M47.117188 153.621094 L588.144531 153.621094 L588.144531 702.890625 L47.117188 702.890625 Z"/></clipPath>
    <clipPath id="b"><path d="M474.957031 153 L852.871094 153 L852.871094 702.878906 L474.957031 702.878906 Z"/></clipPath>
    <clipPath id="c"><path d="M852.871094 702.878906 L663.914062 702.878906 L474.957031 428.246094 L663.914062 153.613281 L852.871094 153.613281 L663.914062 428.246094 Z"/></clipPath>
  </defs>
  <rect x="-20" y="-61.5" width="940" height="940" fill="#0a0a0a"/>
  <g clip-path="url(#a)"><path fill="#ff2d2d" d="M402.199219 424.367188 L584.914062 153.953125 L415.695312 153.953125 L233.492188 423.578125 L419.046875 702.632812 L588.074219 702.632812 Z M47.085938 702.632812 L216.320312 702.632812 L307.910156 565.234375 L138.617188 565.445312 Z M279.792969 243.59375 L216.769531 153.953125 L47.558594 153.953125 L194.550781 369.378906 Z"/></g>
  <g clip-path="url(#b)"><g clip-path="url(#c)"><path fill="#ff2d2d" d="M852.871094 702.878906 L474.957031 702.878906 L474.957031 153.71875 L852.871094 153.71875 Z"/></g></g>
</svg>`.trim();

export default function AppleIcon() {
  return new ImageResponse(
    (
      <img
        width={size.width}
        height={size.height}
        src={`data:image/svg+xml;utf8,${encodeURIComponent(MARK)}`}
        alt="pedrotx"
      />
    ),
    { ...size },
  );
}
