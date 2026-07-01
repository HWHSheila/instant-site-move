import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Rating {
  label: string
  value: number | string
}

interface Props {
  firstName?: string
  lastName?: string
  email?: string
  ratings?: Rating[]
  topSymptoms?: string
  submittedAt?: string
}

const Email = ({
  firstName = '',
  lastName = '',
  email = '',
  ratings = [],
  topSymptoms = 'Not provided',
  submittedAt = new Date().toISOString(),
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>
      New HWH Gut Reset baseline from {firstName} {lastName}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>HWH 30-Day Gut Reset</Heading>
        <Text style={subtitle}>New Baseline Submission</Text>
        <Hr style={hr} />

        <Section>
          <Text style={label}>First Name</Text>
          <Text style={value}>{firstName}</Text>
          <Text style={label}>Last Name</Text>
          <Text style={value}>{lastName}</Text>
          <Text style={label}>Email</Text>
          <Text style={value}>{email}</Text>
        </Section>

        <Hr style={hr} />

        <Heading as="h2" style={h2}>
          Ratings (1–10)
        </Heading>
        <Section>
          {ratings.map((r) => (
            <Row key={r.label} style={ratingRow}>
              <Column style={ratingLabel}>{r.label}</Column>
              <Column style={ratingValue}>{r.value} / 10</Column>
            </Row>
          ))}
        </Section>

        <Hr style={hr} />

        <Heading as="h2" style={h2}>
          Top 3 Symptoms
        </Heading>
        <Text style={value}>{topSymptoms}</Text>

        <Hr style={hr} />

        <Text style={footer}>Submitted: {submittedAt}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Props) =>
    `HWH Gut Reset Baseline — ${data.firstName ?? ''} ${data.lastName ?? ''}`.trim(),
  displayName: 'Baseline Submission Notification',
  to: 'support@herwellnessharmony.com',
  previewData: {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    ratings: [
      { label: 'Energy', value: 5 },
      { label: 'Digestion', value: 6 },
    ],
    topSymptoms: 'Bloating, fatigue, brain fog',
    submittedAt: new Date().toISOString(),
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Georgia, serif',
}
const container = { padding: '32px 28px', maxWidth: '600px' }
const h1 = { color: '#264033', fontSize: '24px', margin: '0 0 4px' }
const h2 = { color: '#264033', fontSize: '18px', margin: '20px 0 8px' }
const subtitle = { color: '#628371', fontSize: '14px', margin: '0' }
const label = {
  color: '#628371',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '12px 0 2px',
}
const value = { color: '#264033', fontSize: '15px', margin: '0' }
const ratingRow = { padding: '6px 0', borderBottom: '1px solid #F0EDE6' }
const ratingLabel = { color: '#264033', fontSize: '14px' }
const ratingValue = {
  color: '#264033',
  fontSize: '14px',
  textAlign: 'right' as const,
  fontWeight: 600,
}
const hr = { borderColor: '#E6E2DA', margin: '20px 0' }
const footer = { color: '#888', fontSize: '12px', margin: '12px 0 0' }
