import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().trim().email(),
  toolSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  source: z.string().min(1).max(64).default("tool_page"),
});

const LOOPS_CREATE_URL = "https://app.loops.so/api/v1/contacts/create";
const LOOPS_UPDATE_URL = "https://app.loops.so/api/v1/contacts/update";

async function subscribeViaLoops(
  email: string,
  toolSlug: string | undefined,
  source: string,
): Promise<{ ok: true } | { ok: false; status: number }> {
  const apiKey = process.env.LOOPS_API_KEY;
  if (!apiKey) {
    return { ok: false, status: 500 };
  }

  const mailingListId = process.env.LOOPS_MAILING_LIST_ID;
  const payload: Record<string, unknown> = {
    email,
    source: "Reset Website",
    userGroup: source === "tool_page" ? "Tool signups" : "Website signups",
  };

  if (toolSlug) {
    payload.toolSlug = toolSlug;
  }

  if (mailingListId) {
    payload.mailingLists = { [mailingListId]: true };
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const createResponse = await fetch(LOOPS_CREATE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (createResponse.ok) {
    return { ok: true };
  }

  if (createResponse.status === 409) {
    const updateResponse = await fetch(LOOPS_UPDATE_URL, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    return updateResponse.ok ? { ok: true } : { ok: false, status: updateResponse.status };
  }

  return { ok: false, status: createResponse.status };
}

async function subscribeViaWebhook(
  webhookUrl: string,
  email: string,
  toolSlug: string | undefined,
  source: string,
): Promise<boolean> {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      toolSlug,
      source,
      subscribedAt: new Date().toISOString(),
    }),
  });

  return response.ok;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const { email, toolSlug, source } = parsed.data;

  if (process.env.LOOPS_API_KEY) {
    try {
      const result = await subscribeViaLoops(email, toolSlug, source);
      if (!result.ok) {
        console.error("Loops subscribe failed:", result.status);
        return Response.json(
          { error: "Subscription failed. Please try again later." },
          { status: 502 },
        );
      }
    } catch (error) {
      console.error("Loops subscribe error:", error);
      return Response.json(
        { error: "Subscription failed. Please try again later." },
        { status: 502 },
      );
    }
  } else if (process.env.NEWSLETTER_WEBHOOK_URL) {
    try {
      const ok = await subscribeViaWebhook(
        process.env.NEWSLETTER_WEBHOOK_URL,
        email,
        toolSlug,
        source,
      );
      if (!ok) {
        return Response.json(
          { error: "Subscription failed. Please try again later." },
          { status: 502 },
        );
      }
    } catch (error) {
      console.error("Newsletter webhook error:", error);
      return Response.json(
        { error: "Subscription failed. Please try again later." },
        { status: 502 },
      );
    }
  } else if (process.env.NODE_ENV === "development") {
    console.info("[newsletter] signup (no provider configured):", {
      email,
      toolSlug,
      source,
    });
  }

  return Response.json({ ok: true });
}
