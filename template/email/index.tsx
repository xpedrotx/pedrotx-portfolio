import React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Img,
  Row,
  Column,
  Link,
  Button,
  Hr,
} from "react-email";

import { profile, socials } from "@/constant";

interface EmailTemplateProps {
  userName: string;
  contactReason: string;
  userMessage: string;
}

export function EmailTemplate({
  userName,
  contactReason,
  userMessage,
}: EmailTemplateProps) {
  const previewText = `Recebi sua mensagem, ${userName}. Respondo em breve!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Row>
              <Column style={{ width: "48px" }}>
                <Img
                  src={`${process.env.NEXT_PUBLIC_SITE_URL || "https://pedrotx.com.br"}/images/logodark.svg`}
                  alt="PT"
                  width="40"
                  height="40"
                  style={logoStyle}
                />
              </Column>

              <Column>
                <Text style={brandName}>{profile.name.full}</Text>
                <Text style={brandSub}>{profile.work.title}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={cardBody}>
            <Text style={greeting}>Oi {userName},</Text>

            <Text style={paragraph}>
              Recebi sua mensagem pelo portfólio, obrigado por escrever.
            </Text>

            <Text style={paragraph}>
              Vou ler com calma e te respondo assim que possível.
            </Text>

            <Section style={messageCard}>
              <Text style={cardBadge}>SUA MENSAGEM</Text>

              <Text style={reasonText}>
                <strong>Motivo:</strong> {contactReason}
              </Text>

              <Text style={messageLabel}>
                <strong>Mensagem:</strong>
              </Text>

              <div style={codeWindow}>
                <pre style={codeContent}>{userMessage}</pre>
              </div>
            </Section>

            <Text style={paragraph}>
              Se quiser acrescentar algo, é só responder a este email.
            </Text>

            <Section style={ctaSection}>
              <Button href={`mailto:${profile.email}`} style={ctaButton}>
                Responder
              </Button>
            </Section>

            <Hr style={divider} />

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
          </Section>

          <Section style={footerSection}>
            <Text style={footerText}>
              <strong>{profile.name.full}</strong>
              {profile.work.title}
              {profile.curr_location.city}, {profile.curr_location.state}
            </Text>

            <Text style={footerSub}>
              Confirmação automática de que sua mensagem foi recebida pelo
              portfólio.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main: React.CSSProperties = {
  backgroundColor: "#090812",
  padding: "40px 16px",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  color: "#e2e8f0",
  lineHeight: "1.6",
};

const container: React.CSSProperties = {
  maxWidth: "580px",
  margin: "0 auto",
};

const headerSection: React.CSSProperties = {
  backgroundColor: "#131022",
  borderRadius: "16px 16px 0 0",
  border: "1px solid rgba(167, 139, 250, 0.2)",
  borderBottom: "none",
  padding: "24px 28px",
};

const logoStyle: React.CSSProperties = {
  borderRadius: "8px",
};

const brandName: React.CSSProperties = {
  color: "#f8fafc",
  fontSize: "18px",
  fontWeight: "700",
  margin: "0",
  letterSpacing: "0.5px",
};

const brandSub: React.CSSProperties = {
  color: "#a78bfa",
  fontSize: "12px",
  margin: "2px 0 0 0",
  fontFamily: "monospace",
};

const cardBody: React.CSSProperties = {
  backgroundColor: "#0d0a17",
  borderRadius: "0 0 16px 16px",
  border: "1px solid rgba(167, 139, 250, 0.2)",
  padding: "28px",
};

const greeting: React.CSSProperties = {
  color: "#f8fafc",
  fontSize: "22px",
  fontWeight: "700",
  marginBottom: "16px",
  marginTop: "0",
};

const paragraph: React.CSSProperties = {
  color: "#cbd5e1",
  fontSize: "15px",
  marginBottom: "18px",
};

const messageCard: React.CSSProperties = {
  backgroundColor: "#151128",
  borderRadius: "12px",
  border: "1px solid rgba(167, 139, 250, 0.15)",
  padding: "18px",
  marginBottom: "20px",
};

const cardBadge: React.CSSProperties = {
  color: "#a78bfa",
  fontSize: "11px",
  fontFamily: "monospace",
  letterSpacing: "1px",
  margin: "0 0 10px 0",
};

const reasonText: React.CSSProperties = {
  color: "#e2e8f0",
  fontSize: "14px",
  margin: "0 0 10px 0",
};

const messageLabel: React.CSSProperties = {
  color: "#e2e8f0",
  fontSize: "14px",
  margin: "0 0 6px 0",
};

const codeWindow: React.CSSProperties = {
  backgroundColor: "#090710",
  borderRadius: "8px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  padding: "14px",
};

const codeContent: React.CSSProperties = {
  color: "#a78bfa",
  fontFamily: "monospace",
  fontSize: "13px",
  margin: "0",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

const ctaSection: React.CSSProperties = {
  textAlign: "center",
  margin: "24px 0",
};

const ctaButton: React.CSSProperties = {
  backgroundColor: "#7c3aed",
  color: "#ffffff",
  borderRadius: "10px",
  padding: "12px 24px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
  boxShadow: "0 4px 14px rgba(124, 58, 237, 0.4)",
};

const divider: React.CSSProperties = {
  borderColor: "rgba(167, 139, 250, 0.15)",
  margin: "24px 0",
};

const socialSection: React.CSSProperties = {
  textAlign: "center",
};

const socialHeader: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: "11px",
  fontFamily: "monospace",
  margin: "0 0 12px 0",
};

const socialTable: React.CSSProperties = {
  margin: "0 auto",
  borderSpacing: "6px",
  borderCollapse: "separate",
};

const socialPill: React.CSSProperties = {
  backgroundColor: "rgba(167, 139, 250, 0.08)",
  borderRadius: "6px",
  padding: "6px 12px",
};

const socialLink: React.CSSProperties = {
  color: "#c4b5fd",
  fontSize: "12px",
  fontFamily: "monospace",
  textDecoration: "none",
};

const footerSection: React.CSSProperties = {
  textAlign: "center",
  marginTop: "20px",
};

const footerText: React.CSSProperties = {
  color: "#64748b",
  fontSize: "12px",
  margin: "0 0 4px 0",
};

const footerSub: React.CSSProperties = {
  color: "#475569",
  fontSize: "11px",
  fontStyle: "italic",
  margin: "0",
};
