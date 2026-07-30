import posthog from "posthog-js";

const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const host = import.meta.env.VITE_POSTHOG_HOST as string | undefined;

if (!key && import.meta.env.DEV) {
  console.error(
    "VITE_POSTHOG_KEY variable required by PostHog is missing or un-configured, " +
      "this causes events to be silently missed. " +
      "This error stops appearing once VITE_POSTHOG_KEY is configured"
  );
}

if (!host && import.meta.env.DEV) {
  console.error(
    "VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, " +
      "this causes events to be silently missed. " +
      "This error stops appearing once VITE_POSTHOG_HOST is configured"
  );
}

if (key && host) {
  posthog.init(key, {
    api_host: host,
    defaults: "2026-05-30",
    capture_pageview: "history_change",
  });
}

export { posthog };
