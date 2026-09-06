import test from "node:test";
import assert from "node:assert/strict";
import { loadModule } from "./helpers/load-module.mjs";
const valid = {
  senderName: "Pedro",
  senderEmail: "visitor@example.com",
  reasonToContact: "Projeto",
  senderMsg: "Olá, gostaria de conversar.",
};
const validation = loadModule("lib/contact-validation.ts");
test("contact rejects non-object payloads and empty values", () => {
  for (const value of [null, [], 1, "hello", {}])
    assert.ok(validation.validateContact(value).error);
  for (const value of [" ", "<b></b>", "\n"])
    assert.ok(
      validation.validateContact({ ...valid, senderName: value }).error,
    );
});
test("contact rejects header control characters, invalid email and oversized fields", () => {
  for (const [field, value] of [
    ["senderName", "a\nb"],
    ["senderEmail", "bad"],
    ["senderMsg", "x".repeat(2001)],
  ])
    assert.ok(validation.validateContact({ ...valid, [field]: value }).error);
});
test("contact accepts Unicode and multiline messages", () => {
  const result = validation.validateContact({
    ...valid,
    senderName: "  João  ",
    senderMsg: "Olá\nSegunda linha",
  });
  assert.equal(result.data.senderName, "João");
  assert.equal(result.data.senderMsg, "Olá\nSegunda linha");
});
test("body reader rejects malformed and oversized requests without trusting content-length", async () => {
  const { readContactBody } = loadModule("lib/request-body.ts");
  for (const body of ["{", "x".repeat(17000)])
    await assert.rejects(
      readContactBody(
        new Request("https://example.com", { method: "POST", body }),
      ),
    );
  assert.equal(
    await readContactBody(
      new Request("https://example.com", { method: "POST", body: "null" }),
    ),
    null,
  );
});
test("indexing requires explicit production permission", () => {
  for (const [env, expected] of [
    [{}, false],
    [{ ALLOW_INDEXING: "true", VERCEL_ENV: "preview" }, false],
    [{ ALLOW_INDEXING: "true", VERCEL_ENV: "production" }, true],
  ]) {
    assert.equal(
      loadModule("lib/indexing.ts", {
        globals: { process: { env } },
      }).isIndexable(),
      expected,
    );
  }
});
test("consent revocation blocks events and clears attribution", () => {
  const storage = new Map();
  const events = [];
  const listeners = new Map();
  const win = {
    location: { hostname: "www.pedrotx.com.br" },
    gtag: (...args) => events.push(args),
    dispatchEvent: () => {},
    addEventListener: (k, v) => listeners.set(k, v),
    removeEventListener: () => {},
  };
  const globals = {
    window: win,
    document: { cookie: "_ga=abc" },
    Event: class {},
    localStorage: {
      getItem: (k) => storage.get(k),
      setItem: (k, v) => storage.set(k, v),
      removeItem: (k) => storage.delete(k),
    },
    sessionStorage: { removeItem: (k) => storage.delete(k) },
    process: { env: { NEXT_PUBLIC_GA_ID: "G-TEST" } },
  };
  const consent = loadModule("lib/consent.ts", { globals });
  const analytics = loadModule("lib/analytics.ts", {
    globals,
    mocks: { "./consent": consent },
  });
  analytics.trackLead();
  assert.equal(events.length, 0);
  consent.setConsent("granted");
  analytics.trackLead();
  assert.ok(events.some((e) => e[0] === "event"));
  storage.set("pedrotx_attribution", "campaign");
  consent.setConsent("denied");
  const count = events.length;
  analytics.trackLead();
  assert.equal(events.length, count);
  assert.equal(storage.has("pedrotx_attribution"), false);
  assert.equal(win["ga-disable-G-TEST"], true);
  consent.setConsent("granted");
  assert.equal(win["ga-disable-G-TEST"], false);
});
test("campaign storage requires consent and excludes arbitrary query parameters", () => {
  let allowed = false;
  const storage = new Map();
  const utm = loadModule("lib/utm.ts", {
    mocks: {
      "./consent": { getConsent: () => (allowed ? "granted" : "denied") },
    },
    globals: {
      window: {
        location: {
          origin: "https://example.com",
          pathname: "/",
          search: "?utm_source=test&email=private@example.com",
        },
        sessionStorage: {
          getItem: (k) => storage.get(k),
          setItem: (k, v) => storage.set(k, v),
        },
      },
      document: { referrer: "https://external.test/path?secret=abc" },
    },
  });
  utm.captureAttribution();
  assert.equal(storage.size, 0);
  allowed = true;
  utm.captureAttribution();
  const data = JSON.parse(storage.get("pedrotx_attribution"));
  assert.equal(data.landing_page, "/");
  assert.equal(data.referrer, "https://external.test");
  assert.equal(JSON.stringify(data).includes("private"), false);
});
test("memory limiter enforces the request limit", async () => {
  const { rateLimit } = loadModule("lib/rate-limit.ts");
  assert.equal(
    (await rateLimit("ip", { maxRequests: 1, windowMs: 1000 })).success,
    true,
  );
  assert.equal(
    (await rateLimit("ip", { maxRequests: 1, windowMs: 1000 })).success,
    false,
  );
});
test("shared limiter hashes IP and fails closed on provider errors", async () => {
  let sent;
  const env = {
    UPSTASH_REDIS_REST_URL: "https://redis.example.com",
    UPSTASH_REDIS_REST_TOKEN: "test-key",
  };
  const { rateLimit } = loadModule("lib/rate-limit.ts", {
    globals: {
      process: { env },
      fetch: async (_url, opts) => {
        sent = opts.body;
        return Response.json({ result: [6, 3500] });
      },
    },
  });
  const result = await rateLimit("192.0.2.1");
  assert.equal(result.success, false);
  assert.equal(result.retryAfter, 4);
  assert.equal(sent.includes("192.0.2.1"), false);
  const broken = loadModule("lib/rate-limit.ts", {
    globals: {
      process: { env },
      fetch: async () => Response.json({ error: "unavailable" }),
    },
  });
  await assert.rejects(broken.rateLimit("ip"));
});
test("Turnstile rejects reused tokens and fails closed when partially configured", async () => {
  const env = { TURNSTILE_SECRET_KEY: "test-secret" };
  let calls = 0;
  const { verifyTurnstile } = loadModule("lib/turnstile.ts", {
    globals: {
      process: { env },
      fetch: async () => Response.json({ success: ++calls === 1 }),
    },
  });
  assert.equal(await verifyTurnstile("token"), true);
  assert.equal(await verifyTurnstile("token"), false);
  assert.equal(
    await loadModule("lib/turnstile.ts", {
      globals: { process: { env: { NEXT_PUBLIC_TURNSTILE_SITE_KEY: "key" } } },
    }).verifyTurnstile("token"),
    false,
  );
});
test("API rejects malformed payloads and returns delivery error without sending confirmation", async () => {
  let sends = 0;
  const mocks = {
    "next/server": {
      NextResponse: { json: (data, options) => Response.json(data, options) },
    },
    resend: {
      Resend: class {
        emails = {
          send: async () => {
            sends++;
            return { error: { message: "failed" } };
          },
        };
      },
    },
    "@/template/email": {
      ClientConfirmationEmail: () => null,
      LeadNotificationEmail: () => null,
    },
    "@/lib/rate-limit": { rateLimit: async () => ({ success: true }) },
    "@/lib/turnstile": { verifyTurnstile: async () => true },
    "@/lib/contact-validation": validation,
    "@/lib/request-body": loadModule("lib/request-body.ts"),
    "@/constant/profile": { profile: { email: "owner@example.com" } },
  };
  const { POST } = loadModule("app/api/send/route.ts", {
    mocks,
    globals: {
      process: {
        env: {
          NEXT_PUBLIC_SITE_URL: "https://example.com/",
          RESEND_API_KEY: "test",
        },
      },
    },
  });
  const request = (body) =>
    new Request("https://example.com/api/send", {
      method: "POST",
      headers: {
        origin: "https://example.com",
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
  assert.equal((await POST(request(null))).status, 400);
  assert.equal(sends, 0);
  assert.equal((await POST(request(valid))).status, 502);
  assert.equal(sends, 1);
});
