import React from "react";
import { Section, Text, Img, Row, Column, Link } from "react-email";

import { profile, socials } from "@/constant";
import { SITE_SEO } from "@/constant/seo";

/** Shared black/red brand chrome (header + footer) for every transactional email. */

// PNG, not the site's SVG mark: SVG isn't rendered by most email clients (Gmail included).
const LOGO_SRC = `${SITE_SEO.siteUrl}/apple-icon`;

export function EmailHeader() {
  return (
    <Section style={headerSection}>
      <Row>
        <Column style={{ width: "48px" }}>
          <Img src={LOGO_SRC} alt="PT" width="40" height="40" style={logoStyle} />
        </Column>

        <Column>
          <Text style={brandName}>{profile.name.brand.toUpperCase()}</Text>
          <Text style={brandSub}>Desenvolvedor Full Stack</Text>
        </Column>
      </Row>
    </Section>
  );
}

export function EmailSocials() {
  return (
    <Section style={socialSection}>
      <Text style={socialHeader}>ME ACHA EM</Text>

      <table style={socialTable}>
        <tbody>
          <tr>
            {socials.map((social) => (
              <td key={social.name} style={socialPill}>
                <Link href={social.url} style={socialLink}>
                  {social.name}
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </Section>
  );
}

export function EmailSignature({ note }: { note: string }) {
  return (
    <Section style={footerSection}>
      <Text style={footerText}>
        <strong>{profile.name.full}</strong>
        {" · "}
        {profile.curr_location.city}, {profile.curr_location.state}
      </Text>

      <Text style={footerSub}>{note}</Text>
    </Section>
  );
}

export const main: React.CSSProperties = {
  backgroundColor: "#0a0a0a",
  padding: "40px 16px",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  color: "#f5f5f5",
  lineHeight: "1.6",
};

export const container: React.CSSProperties = {
  maxWidth: "580px",
  margin: "0 auto",
};

export const headerSection: React.CSSProperties = {
  backgroundColor: "#141414",
  borderRadius: "16px 16px 0 0",
  border: "1px solid rgba(239, 68, 68, 0.2)",
  borderBottom: "none",
  padding: "24px 28px",
};

export const logoStyle: React.CSSProperties = {
  borderRadius: "8px",
};

export const brandName: React.CSSProperties = {
  color: "#f5f5f5",
  fontSize: "18px",
  fontWeight: "700",
  margin: "0",
  letterSpacing: "1px",
};

export const brandSub: React.CSSProperties = {
  color: "#f87171",
  fontSize: "12px",
  margin: "2px 0 0 0",
  fontFamily: "monospace",
};

export const cardBody: React.CSSProperties = {
  backgroundColor: "#0d0d0d",
  borderRadius: "0 0 16px 16px",
  border: "1px solid rgba(239, 68, 68, 0.2)",
  padding: "28px",
};

export const greeting: React.CSSProperties = {
  color: "#f5f5f5",
  fontSize: "22px",
  fontWeight: "700",
  marginBottom: "16px",
  marginTop: "0",
};

export const paragraph: React.CSSProperties = {
  color: "#d4d4d4",
  fontSize: "15px",
  marginBottom: "18px",
};

export const messageCard: React.CSSProperties = {
  backgroundColor: "#171717",
  borderRadius: "12px",
  border: "1px solid rgba(239, 68, 68, 0.15)",
  padding: "18px",
  marginBottom: "20px",
};

export const cardBadge: React.CSSProperties = {
  color: "#f87171",
  fontSize: "11px",
  fontFamily: "monospace",
  letterSpacing: "1px",
  margin: "0 0 10px 0",
};

export const fieldRow: React.CSSProperties = {
  color: "#e5e5e5",
  fontSize: "14px",
  margin: "0 0 10px 0",
};

export const fieldLabel: React.CSSProperties = {
  color: "#e5e5e5",
  fontSize: "14px",
  margin: "0 0 6px 0",
};

export const codeWindow: React.CSSProperties = {
  backgroundColor: "#060606",
  borderRadius: "8px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  padding: "14px",
};

export const codeContent: React.CSSProperties = {
  color: "#fca5a5",
  fontFamily: "monospace",
  fontSize: "13px",
  margin: "0",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export const ctaSection: React.CSSProperties = {
  textAlign: "center",
  margin: "24px 0",
};

export const ctaButton: React.CSSProperties = {
  backgroundColor: "#ef4444",
  color: "#ffffff",
  borderRadius: "10px",
  padding: "12px 24px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
  boxShadow: "0 4px 14px rgba(239, 68, 68, 0.4)",
};

export const divider: React.CSSProperties = {
  borderColor: "rgba(239, 68, 68, 0.15)",
  margin: "24px 0",
};

export const socialSection: React.CSSProperties = {
  textAlign: "center",
};

export const socialHeader: React.CSSProperties = {
  color: "#a3a3a3",
  fontSize: "11px",
  fontFamily: "monospace",
  margin: "0 0 12px 0",
};

export const socialTable: React.CSSProperties = {
  margin: "0 auto",
  borderSpacing: "6px",
  borderCollapse: "separate",
};

export const socialPill: React.CSSProperties = {
  backgroundColor: "rgba(239, 68, 68, 0.08)",
  borderRadius: "6px",
  padding: "6px 12px",
};

export const socialLink: React.CSSProperties = {
  color: "#fca5a5",
  fontSize: "12px",
  fontFamily: "monospace",
  textDecoration: "none",
};

export const footerSection: React.CSSProperties = {
  textAlign: "center",
  marginTop: "20px",
};

export const footerText: React.CSSProperties = {
  color: "#737373",
  fontSize: "12px",
  margin: "0 0 4px 0",
};

export const footerSub: React.CSSProperties = {
  color: "#525252",
  fontSize: "11px",
  fontStyle: "italic",
  margin: "0",
};
