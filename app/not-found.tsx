import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <Section spacing="lg">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-neutral-500">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-neutral-600">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Try heading back home or browsing our tools.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/">
            <Button>Go home</Button>
          </Link>
          <Link href="/tools">
            <Button variant="secondary">Browse tools</Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}
