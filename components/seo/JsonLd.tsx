import type { JsonLdSchema } from "@/types/seo";

interface JsonLdProps {
  schema: JsonLdSchema | JsonLdSchema[] | null;
}

export function JsonLd({ schema }: JsonLdProps) {
  if (!schema) return null;

  const schemas = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {schemas.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
