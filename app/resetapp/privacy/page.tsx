import type { Metadata } from "next";
import { PageHeading } from "@/components/ui/PageHeading";
import { Section } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const APP_PRIVACY_PATH = "/resetapp/privacy";
const CONTACT_EMAIL = "gunaedkhan@gmail.com";

export const metadata: Metadata = createMetadata({
  title: "Reset Privacy Policy",
  description:
    "Privacy policy for the Reset Android app — what data we collect, how we use it, and your choices.",
  path: APP_PRIVACY_PATH,
});

function PolicyTable({
  headers,
  rows,
}: {
  headers: [string, string];
  rows: [string, string][];
}) {
  return (
    <div className="not-prose my-6 overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200">
            <th className="py-3 pr-4 font-semibold text-neutral-900">{headers[0]}</th>
            <th className="py-3 font-semibold text-neutral-900">{headers[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([left, right]) => (
            <tr key={left} className="border-b border-neutral-100 align-top">
              <td className="py-3 pr-4 font-medium text-neutral-900">{left}</td>
              <td className="py-3 text-neutral-600">{right}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ResetAppPrivacyPage() {
  return (
    <>
      <Section spacing="md" className="border-b border-neutral-100 bg-neutral-50/50">
        <PageHeading
          title="Reset Privacy Policy"
          description="Last updated: August 2026"
        />
      </Section>

      <Section spacing="md">
        <article className="prose mx-auto max-w-3xl">
          <p>
            <strong>Data controller:</strong> Junaed Khan, Greater Manchester, United
            Kingdom
            <br />
            <strong>Contact:</strong>{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <br />
            <strong>Website:</strong>{" "}
            <a href={siteConfig.url}>{siteConfig.url.replace(/\/$/, "")}/</a>
          </p>

          <h2>Overview</h2>
          <p>
            Reset (&quot;we&quot;, &quot;us&quot;, &quot;the app&quot;) is an Android
            distraction-intervention app. This policy explains what personal data we
            collect, why we use it, who we share it with, and your choices.
          </p>
          <p>
            Reset is intended for adults aged <strong>18 and over</strong>. We do not
            knowingly collect data from anyone under 18.
          </p>

          <h2>Data we collect</h2>
          <PolicyTable
            headers={["Data", "Purpose"]}
            rows={[
              ["Email address", "Account sign-in and support via Supabase Auth"],
              [
                "Goals (title, reason, target date)",
                "Personalize intervention reflections",
              ],
              [
                "Distracting app package names",
                "Detect when to trigger an intervention",
              ],
              [
                "Intervention answers and outcomes",
                "Reflection history and in-app analytics",
              ],
              [
                "App settings (focus schedule, detection preferences, etc.)",
                "Provide the service you configure",
              ],
              [
                "Optional Premium coaching text",
                "Personalized closing messages and next-action suggestions when Premium is enabled",
              ],
              [
                "Feature suggestions (optional)",
                "Improve the product when you submit feedback from the About screen",
              ],
              [
                "Google Play purchase status",
                "Enable or restore Reset Premium features",
              ],
            ]}
          />

          <h2>Data we do not collect</h2>
          <ul>
            <li>Screen content, keystrokes, passwords, or text inside other apps</li>
            <li>Contacts, photos, files, or precise location</li>
            <li>Browsing history or message content</li>
            <li>
              Advertising identifiers or analytics/crash-reporting data (we do not use
              Firebase Analytics, Sentry, or similar tools)
            </li>
          </ul>
          <p>
            Detection uses <strong>foreground app package names only</strong> via Android
            Accessibility (primary) and Usage Stats (fallback). The accessibility
            service is configured not to read window content (
            <code>canRetrieveWindowContent=false</code>).
          </p>

          <h2>How we use your data</h2>
          <p>We use your data to:</p>
          <ul>
            <li>Provide and maintain your Reset account</li>
            <li>Run distraction interventions and focus timers</li>
            <li>Store your goals, settings, and history</li>
            <li>Process Premium subscriptions and restore purchases</li>
            <li>Generate optional Premium coaching via our servers and AI provider</li>
            <li>Respond to support requests</li>
          </ul>
          <p>
            We do <strong>not</strong> sell your personal data and we do{" "}
            <strong>not</strong> show ads.
          </p>

          <h2>Legal basis (United Kingdom)</h2>
          <p>If UK data protection law applies, we rely on:</p>
          <ul>
            <li>
              <strong>Contract</strong> — to provide the Reset service you sign up for
            </li>
            <li>
              <strong>Legitimate interests</strong> — to secure the app, prevent abuse,
              and improve reliability, balanced against your rights
            </li>
            <li>
              <strong>Consent</strong> — where required for optional Premium AI coaching
              and Android permissions you grant in system settings
            </li>
          </ul>

          <h2>Permissions</h2>
          <ul>
            <li>
              <strong>Accessibility service</strong> — detects when a selected app
              becomes foreground; package name only
            </li>
            <li>
              <strong>Usage access</strong> — fallback foreground detection
            </li>
            <li>
              <strong>Notifications</strong> — required foreground-service notification
              while monitoring is active
            </li>
            <li>
              <strong>Internet</strong> — sync with Supabase; Premium coaching API calls
            </li>
            <li>
              <strong>Wake lock (optional)</strong> — keep the screen on during focus
              timers when you enable that setting
            </li>
          </ul>

          <h2>Storage, security, and location</h2>
          <ul>
            <li>
              Account and app data are stored in <strong>Supabase (PostgreSQL)</strong>{" "}
              in the <strong>Canada (ca-central-1)</strong> region, protected by
              row-level security so each user can access only their own data
            </li>
            <li>
              Authentication tokens are handled by Supabase client libraries on your
              device
            </li>
            <li>
              Premium coaching sends intervention context (goal, trigger app, your
              answers) to our API at{" "}
              <strong>reset-api-fajrsociety.fly.dev</strong> over HTTPS; that service
              uses <strong>Google Gemini</strong> to generate responses. We do not send
              your email address to Gemini for coaching
            </li>
          </ul>

          <h2>Data retention and deletion</h2>
          <p>We retain your data while your account is active.</p>
          <p>
            You can <strong>delete your account in the app</strong> from{" "}
            <strong>Settings → Delete account</strong>. Deletion removes your account
            and associated data from our database. Some records may remain briefly in
            encrypted backups and are purged on our providers&apos; normal backup
            rotation.
          </p>
          <p>
            Active Google Play subscriptions are managed by Google. Deleting your Reset
            account does not automatically cancel billing — cancel in{" "}
            <strong>Google Play → Payments &amp; subscriptions</strong> if needed.
          </p>

          <h2>Third parties</h2>
          <PolicyTable
            headers={["Provider", "Role"]}
            rows={[
              ["Supabase", "Authentication and database hosting (Canada)"],
              ["Fly.io", "Hosts our Premium coaching API"],
              [
                "Google (Gemini)",
                "Generates Premium coaching text from intervention context",
              ],
              ["Google Play", "Subscription billing and purchase verification"],
            ]}
          />
          <p>We share only what is necessary for these services to operate.</p>

          <h2>Subscriptions</h2>
          <p>
            Reset Premium is an optional subscription purchased through Google Play.
            Available plans include <strong>weekly</strong>, <strong>annual</strong>{" "}
            (includes a <strong>3-day free trial</strong> where offered), and optionally{" "}
            <strong>monthly</strong>. Payment is processed by Google; we receive
            purchase status to unlock Premium features. Cancel anytime in your Google
            Play account settings.
          </p>

          <h2>Your rights</h2>
          <p>
            Depending on where you live, you may have rights to access, correct, delete,
            or restrict use of your personal data, and to object to certain processing.
            UK users may also complain to the{" "}
            <strong>Information Commissioner&apos;s Office (ICO)</strong>.
          </p>
          <p>
            To exercise your rights, delete your account in Settings or email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>

          <h2>International transfers</h2>
          <p>
            Your data is stored in Canada (Supabase). Premium coaching may be processed
            in regions where our API and Google Gemini operate. We use providers that
            apply appropriate safeguards for cross-border transfers.
          </p>

          <h2>Changes</h2>
          <p>
            We may update this policy from time to time. Material changes will be
            reflected on this page and in the in-app About screen. Continued use of
            Reset after an update means you accept the revised policy.
          </p>

          <h2>Contact</h2>
          <p>
            <strong>Junaed Khan</strong>
            <br />
            Greater Manchester, United Kingdom
            <br />
            Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </article>
      </Section>
    </>
  );
}
