import { Html, Head, Preview, Body, Container, Section, Text, Button, Hr } from "react-email";

import {
  EmailHeader,
  EmailSocials,
  EmailSignature,
  main,
  container,
  cardBody,
  greeting,
  paragraph,
  messageCard,
  cardBadge,
  fieldRow,
  fieldLabel,
  codeWindow,
  codeContent,
  ctaSection,
  ctaButton,
  divider,
} from "./shared";

interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  landing_page?: string;
  referrer?: string;
}

const ATTRIBUTION_LABELS: Record<keyof Attribution, string> = {
  utm_source: "Fonte",
  utm_medium: "Meio",
  utm_campaign: "Campanha",
  utm_term: "Termo",
  utm_content: "Conteúdo",
  gclid: "Google Ads",
  fbclid: "Meta Ads",
  msclkid: "Microsoft Ads",
  landing_page: "Página de entrada",
  referrer: "Referência",
};

interface LeadNotificationEmailProps {
  senderName: string;
  senderEmail: string;
  contactReason: string;
  senderMessage: string;
  attribution?: Attribution;
}

export function LeadNotificationEmail({
  senderName,
  senderEmail,
  contactReason,
  senderMessage,
  attribution,
}: LeadNotificationEmailProps) {
  const previewText = `Novo contato de ${senderName}: ${contactReason}`;
  const receivedAt = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());

  const attributionRows = Object.entries(attribution ?? {}).filter(
    ([, value]) => typeof value === "string" && value.length > 0,
  ) as [keyof Attribution, string][];

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Body style={main}>
        <Container style={container}>
          <EmailHeader />

          <Section style={cardBody}>
            <Text style={greeting}>Novo contato pelo portfólio</Text>

            <Text style={paragraph}>
              {senderName} preencheu o formulário em {receivedAt} (horário de
              Brasília).
            </Text>

            <Section style={messageCard}>
              <Text style={cardBadge}>NOVO LEAD</Text>

              <Text style={fieldRow}>
                <strong>Nome:</strong> {senderName}
              </Text>
              <Text style={fieldRow}>
                <strong>Email:</strong> {senderEmail}
              </Text>
              <Text style={fieldRow}>
                <strong>Motivo:</strong> {contactReason}
              </Text>

              <Text style={fieldLabel}>
                <strong>Mensagem:</strong>
              </Text>

              <div style={codeWindow}>
                <pre style={codeContent}>{senderMessage}</pre>
              </div>
            </Section>

            {attributionRows.length > 0 && (
              <Section style={messageCard}>
                <Text style={cardBadge}>ORIGEM</Text>
                {attributionRows.map(([key, value]) => (
                  <Text key={key} style={fieldRow}>
                    <strong>{ATTRIBUTION_LABELS[key]}:</strong> {value}
                  </Text>
                ))}
              </Section>
            )}

            <Section style={ctaSection}>
              <Button href={`mailto:${senderEmail}`} style={ctaButton}>
                Responder para {senderName}
              </Button>
            </Section>

            <Hr style={divider} />

            <EmailSocials />
          </Section>

          <EmailSignature note="Notificação automática do formulário de contato do portfólio." />
        </Container>
      </Body>
    </Html>
  );
}
