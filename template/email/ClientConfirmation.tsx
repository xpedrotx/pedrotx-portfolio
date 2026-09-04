import { Html, Head, Preview, Body, Container, Section, Text, Hr } from "react-email";

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
  divider,
} from "./shared";

interface ClientConfirmationEmailProps {
  userName: string;
  contactReason: string;
  userMessage: string;
}

export function ClientConfirmationEmail({
  userName,
  contactReason,
  userMessage,
}: ClientConfirmationEmailProps) {
  const previewText = `Recebi sua mensagem, ${userName}. Respondo em breve!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Body style={main}>
        <Container style={container}>
          <EmailHeader />

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

              <Text style={fieldRow}>
                <strong>Motivo:</strong> {contactReason}
              </Text>

              <Text style={fieldLabel}>
                <strong>Mensagem:</strong>
              </Text>

              <div style={codeWindow}>
                <pre style={codeContent}>{userMessage}</pre>
              </div>
            </Section>

            <Hr style={divider} />

            <EmailSocials />
          </Section>

          <EmailSignature note="Confirmação automática de que sua mensagem foi recebida pelo portfólio." />
        </Container>
      </Body>
    </Html>
  );
}
