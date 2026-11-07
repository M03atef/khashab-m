/** Public site URL — env first, then Vercel's production domain, then the live link. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://khashab-m-b2lb.vercel.app")
).replace(/\/$/, "");
