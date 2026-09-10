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
  ctaSection,
  ctaButton,
  divider,
} from "./shared";

interface ResumeRequestNotificationEmailProps {
  requesterName: string;
  requesterEmail: string;
}

export function ResumeRequestNotificationEmail({
  requesterName,
  requesterEmail,
}: ResumeRequestNotificationEmailProps) {
  const previewText = `${requesterName} pediu seu currículo`;
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
            <Text style={greeting}>Novo pedido de currículo</Text>

            <Text style={paragraph}>
              {requesterName} solicitou seu currículo em {receivedAt} (horário de
              Brasília). O PDF já foi enviado automaticamente para o email
              abaixo.
            </Text>

            <Section style={messageCard}>
              <Text style={cardBadge}>QUEM PEDIU</Text>

              <Text style={fieldRow}>
                <strong>Nome:</strong> {requesterName}
              </Text>
              <Text style={fieldRow}>
                <strong>Email:</strong> {requesterEmail}
              </Text>
            </Section>

            <Section style={ctaSection}>
              <Button href={`mailto:${requesterEmail}`} style={ctaButton}>
                Responder para {requesterName}
              </Button>
            </Section>

            <Hr style={divider} />

            <EmailSocials />
          </Section>

          <EmailSignature note="Notificação automática do portfólio." />
        </Container>
      </Body>
    </Html>
  );
}
