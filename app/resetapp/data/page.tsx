import type { Metadata } from "next";
import Link from "next/link";
import { Callout } from "@/components/ui/Callout";
import { PageHeading } from "@/components/ui/PageHeading";
import { Section } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const DATA_REQUEST_PATH = "/resetapp/data";
const CONTACT_EMAIL = "gunaedkhan@gmail.com";
const APP_NAME = "Reset";

export const metadata: Metadata = createMetadata({
  title: "Reset — Data & Account Deletion",
  description:
    "How to delete your Reset account and personal data, or request partial deletion without closing your account.",
  path: DATA_REQUEST_PATH,
});

function PolicyTable({
  headers,
  rows,
}: {
  headers: [string, string] | [string, string, string];
  rows: string[][];
}) {
  return (
    <div className="not-prose my-6 overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200">
            {headers.map((header) => (
              <th key={header} className="py-3 pr-4 font-semibold text-neutral-900 last:pr-0">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-neutral-100 align-top">
              {row.map((cell, index) => (
                <td
                  key={`${row[0]}-${index}`}
                  className={
                    index === 0
                      ? "py-3 pr-4 font-medium text-neutral-900"
                      : "py-3 pr-4 text-neutral-600 last:pr-0"
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ResetAppDataPage() {
  return (
    <>
      <Section spacing="md" className="border-b border-neutral-100 bg-neutral-50/50">
        <PageHeading
          title={`${APP_NAME} — Data & Account Deletion`}
          description="Last updated: August 2026"
        />
      </Section>

      <Section spacing="md">
        <article className="prose mx-auto max-w-3xl">
          <p>
            This page is for users of <strong>{APP_NAME}</strong>, the Android
            distraction-intervention app published by <strong>Junaed Khan</strong>{" "}
            (Greater Manchester, United Kingdom) on Google Play. It explains how to
            delete your account and personal data, or request that specific data be
            deleted while keeping your account open.
          </p>
          <p>
            For our full privacy policy, see{" "}
            <Link href="/resetapp/privacy">Reset Privacy Policy</Link>.
          </p>

          <h2>Delete your entire Reset account</h2>
          <p>
            The fastest way to delete your account and all associated personal data
            is in the app:
          </p>

          <div className="not-prose my-6">
            <Callout variant="info" title="Steps to delete your Reset account">
              <ol className="mt-2 list-decimal space-y-2 pl-5">
                <li>Open the <strong>Reset</strong> app on your Android device.</li>
                <li>Go to <strong>Settings</strong>.</li>
                <li>Tap <strong>Delete account</strong>.</li>
                <li>Confirm when prompted.</li>
              </ol>
            </Callout>
          </div>

          <p>
            After confirmation, we delete your account and the personal data listed
            below from our live database. You will be signed out immediately and
            cannot recover the account afterward.
          </p>
          <p>
            <strong>Google Play subscriptions:</strong> Deleting your Reset account
            does not cancel an active Premium subscription. Cancel billing in{" "}
            <strong>Google Play → Payments &amp; subscriptions</strong> if you no
            longer want to be charged.
          </p>

          <h2>Request data deletion without deleting your account</h2>
          <p>
            You can ask us to delete some or all of your stored data while keeping
            your Reset account. Email us from the address tied to your account:
          </p>

          <div className="not-prose my-6">
            <Callout variant="info" title="Steps to request partial or full data deletion">
              <ol className="mt-2 list-decimal space-y-2 pl-5">
                <li>
                  Email{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium underline">
                    {CONTACT_EMAIL}
                  </a>{" "}
                  from your registered Reset account email.
                </li>
                <li>
                  Use the subject line: <strong>Reset data deletion request</strong>.
                </li>
                <li>
                  State whether you want specific categories deleted (see table below)
                  or <strong>all stored app data except your login email</strong>.
                </li>
                <li>
                  We will confirm by reply email once the deletion is complete, usually
                  within <strong>30 days</strong>.
                </li>
              </ol>
            </Callout>
          </div>

          <p>
            If you want every category removed including the ability to sign in, use
            account deletion in Settings instead — that permanently closes your
            account.
          </p>

          <h2>What data is deleted</h2>
          <p>
            When you delete your Reset account, or when we process a data-deletion
            request you specify, we remove the relevant records from our Supabase
            database. The table below shows what each option covers.
          </p>

          <PolicyTable
            headers={["Data type", "Deleted with account", "Can delete without account"]}
            rows={[
              [
                "Email address & account credentials",
                "Yes — account is permanently removed",
                "No — email is required to keep the account open",
              ],
              [
                "Goals (title, reason, target date)",
                "Yes",
                "Yes — on request",
              ],
              [
                "Distracting app package names (your selections)",
                "Yes",
                "Yes — on request",
              ],
              [
                "Intervention answers, outcomes, and history",
                "Yes",
                "Yes — on request",
              ],
              [
                "App settings (focus schedule, detection preferences, etc.)",
                "Yes",
                "Yes — on request",
              ],
              [
                "Premium coaching messages generated for you",
                "Yes",
                "Yes — on request",
              ],
              [
                "Feature suggestions you submitted from About",
                "Yes",
                "Yes — on request",
              ],
              [
                "Google Play purchase / Premium status we store",
                "Yes — our copy is removed with the account",
                "Yes — our copy can be cleared on request; Google Play billing records remain with Google",
              ],
            ]}
          />

          <h2>What we do not delete or what may be kept temporarily</h2>
          <PolicyTable
            headers={["Data", "What happens"]}
            rows={[
              [
                "Encrypted database backups (Supabase)",
                "Removed on our provider's normal backup rotation — typically within a few weeks after live deletion",
              ],
              [
                "Google Play payment & subscription records",
                "Retained by Google under Google's policies; manage or delete via your Google account",
              ],
              [
                "Premium coaching API logs (Fly.io / Google Gemini)",
                "We do not retain coaching prompts for marketing. Any transient processing logs at our providers are short-lived and not linked to your account after deletion",
              ],
              [
                "Support emails you send us",
                "Kept only as long as needed to handle your request and meet legal obligations, then deleted or anonymized",
              ],
            ]}
          />

          <h2>Data we never collect</h2>
          <p>
            Reset does not collect screen content, keystrokes, contacts, photos,
            precise location, browsing history, or advertising identifiers. Deleting
            your account does not apply to data we never stored. See our{" "}
            <Link href="/resetapp/privacy">privacy policy</Link> for details.
          </p>

          <h2>Contact</h2>
          <p>
            <strong>Junaed Khan</strong> — developer of {APP_NAME}
            <br />
            Greater Manchester, United Kingdom
            <br />
            Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <br />
            Website:{" "}
            <a href={siteConfig.url}>{siteConfig.url.replace(/\/$/, "")}/</a>
          </p>
        </article>
      </Section>
    </>
  );
}
