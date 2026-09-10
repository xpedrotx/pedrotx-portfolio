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
  divider,
} from "./shared";

interface ResumeDeliveryEmailProps {
  userName: string;
}

export function ResumeDeliveryEmail({ userName }: ResumeDeliveryEmailProps) {
  const previewText = `Aqui está meu currículo, ${userName}. Está em anexo.`;

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
              Obrigado pelo interesse. Meu currículo está em anexo neste email,
              em PDF.
            </Text>

            <Text style={paragraph}>
              Estou aberto a oportunidades e a boas conversas sobre código. Se
              quiser falar sobre uma vaga ou um projeto, é só responder este
              email.
            </Text>

            <Hr style={divider} />

            <EmailSocials />
          </Section>

          <EmailSignature note="Você recebeu este email porque solicitou o currículo pelo portfólio." />
        </Container>
      </Body>
    </Html>
  );
}
