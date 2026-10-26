import { Heading, Link, Stack, Text } from "@primer/react";
import type { ReactNode } from "react";
import { FormattedDate, FormattedMessage } from "react-intl";
import AppBrand from "../../widgets/AppBrand/AppBrand.tsx";
import styles from "./Privacy.module.css";

const dataController = "Paolo Scanferla";
const privacyContactEmail = "info@floor0.dev";
const lastUpdated = new Date(2026, 9, 26);

/** What data Step Review handles, where and why, as the GDPR requires. */
export default function Privacy() {
  const strong = (chunks: ReactNode[]) => <strong>{chunks}</strong>;
  return (
    <div className={styles["page"]}>
      <div className={styles["content"]}>
        <header>
          <AppBrand />
        </header>
        <Stack gap="condensed">
          <Heading as="h1" variant="large">
            <FormattedMessage defaultMessage="Privacy" />
          </Heading>
          <Text className={styles["lastUpdated"]}>
            <FormattedMessage
              defaultMessage="Last updated {date}"
              values={{
                date: <FormattedDate value={lastUpdated} dateStyle="long" />,
              }}
            />
          </Text>
        </Stack>
        <Text as="p">
          <FormattedMessage defaultMessage="Step Review is built so that your code stays with you: there are no accounts, no cookies and no ads, and reviews you open never leave your browser unless you start a collaboration session. This page explains what data Step Review handles, where, and why." />
        </Text>
        <Section
          title={<FormattedMessage defaultMessage="Who is responsible" />}
        >
          <Text as="p">
            <FormattedMessage
              defaultMessage="Step Review is run by {dataController}, the data controller for the processing described here. For any question or request about your data, write to {email}."
              values={{
                dataController,
                email: (
                  <Link href={`mailto:${privacyContactEmail}`}>
                    {privacyContactEmail}
                  </Link>
                ),
              }}
            />
          </Text>
        </Section>
        <Section
          title={
            <FormattedMessage defaultMessage="Data kept in your browser" />
          }
        >
          <Text as="p">
            <FormattedMessage
              defaultMessage="The review files you open, the files you mark as viewed, the sessions you joined (with the keys that open them), your name in sessions and your display preferences are stored in your browser's local storage. <strong>They are not sent to us</strong>, except as described for sessions below."
              values={{ strong }}
            />
          </Text>
          <Text as="p">
            <FormattedMessage defaultMessage="This storage is needed for Step Review to work, so it doesn't require consent. You can remove a review from the start page, or remove everything by clearing this site's data in your browser." />
          </Text>
        </Section>
        <Section
          title={<FormattedMessage defaultMessage="Collaboration sessions" />}
        >
          <Text as="p">
            <FormattedMessage
              defaultMessage="When you start a session, the review is uploaded to our server so that others can join it. Before anything leaves your browser, the review, each participant's name and viewed files, and the step each participant is on are <strong>end-to-end encrypted</strong>, with a key that only the session's links hold. Browsers never send that part of a link, so we can't read any of this data."
              values={{ strong }}
            />
          </Text>
          <Text as="p">
            <FormattedMessage defaultMessage="The server stores the encrypted data and hashes of the secrets that let participants in. It can see how large a session is, when it's used, and how many participants it has. A session is deleted when its owner ends it, or after 30 days without activity." />
          </Text>
          <Text as="p">
            <FormattedMessage defaultMessage="We process this data to provide the sessions you ask for (Article 6(1)(b) GDPR)." />
          </Text>
        </Section>
        <Section
          title={<FormattedMessage defaultMessage="Hosting and network data" />}
        >
          <Text as="p">
            <FormattedMessage
              defaultMessage="Step Review is hosted by {cloudflare}, which processes your IP address and standard request information to deliver the site and protect it from attacks, and may keep it in short-lived logs. To prevent abuse, the server also limits how many sessions an IP address can start per minute; it only keeps those counts for that minute."
              values={{
                cloudflare: (
                  <Link
                    href="https://www.cloudflare.com/privacypolicy/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Cloudflare
                  </Link>
                ),
              }}
            />
          </Text>
          <Text as="p">
            <FormattedMessage defaultMessage="Cloudflare processes this data on our behalf under its data processing addendum. It may do so outside the European Economic Area, protected by the EU Standard Contractual Clauses. We rely on our legitimate interest in running a secure, reliable service (Article 6(1)(f) GDPR)." />
          </Text>
        </Section>
        <Section title={<FormattedMessage defaultMessage="Analytics" />}>
          <Text as="p">
            <FormattedMessage defaultMessage="To see how much Step Review is used and how fast it loads, we use Cloudflare Web Analytics. A script from Cloudflare reports the address of each page you view (without the part after “?” or “#”, so never a session's key), the page you came from, your browser and device type, your country, and how long the page took to load. It uses no cookies or other storage on your device, and doesn't build a profile of you or follow you across sites." />
          </Text>
          <Text as="p">
            <FormattedMessage defaultMessage="We rely on our legitimate interest in understanding how Step Review is used, so that we can improve it (Article 6(1)(f) GDPR)." />
          </Text>
          <Text as="p">
            <FormattedMessage defaultMessage="Step Review uses no other analytics, no advertising and no other third-party scripts. Links to GitHub and floor 0 lead to sites with their own privacy policies." />
          </Text>
        </Section>
        <Section title={<FormattedMessage defaultMessage="Your rights" />}>
          <Text as="p">
            <FormattedMessage defaultMessage="Under the GDPR, you can ask us to access, correct or erase your personal data, to restrict or stop processing it, and to hand it over in a portable format. As we don't know who you are and can't read sessions, we usually can't tell which data is yours: ending a session you own, or clearing this site's data in your browser, is the quickest way to erase it." />
          </Text>
          <Text as="p">
            <FormattedMessage defaultMessage="You also have the right to lodge a complaint with a data protection authority, in particular the one where you live or work." />
          </Text>
        </Section>
        <Section title={<FormattedMessage defaultMessage="Changes" />}>
          <Text as="p">
            <FormattedMessage defaultMessage="If what Step Review does with data changes, we'll update this page and its date." />
          </Text>
        </Section>
      </div>
    </div>
  );
}

interface SectionProps {
  title: ReactNode;
  children: ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className={styles["section"]}>
      <Heading as="h2" variant="small">
        {title}
      </Heading>
      {children}
    </section>
  );
}
