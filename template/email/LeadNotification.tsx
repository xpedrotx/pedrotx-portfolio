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

interface LeadNotificationEmailProps {
  senderName: string;
  senderEmail: string;
  contactReason: string;
  senderMessage: string;
}

export function LeadNotificationEmail({
  senderName,
  senderEmail,
  contactReason,
  senderMessage,
}: LeadNotificationEmailProps) {
  const previewText = `Novo contato de ${senderName}: ${contactReason}`;
  const receivedAt = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());

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
