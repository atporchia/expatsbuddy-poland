/**
 * Checks that every official-source URL responds (2xx/3xx).
 * Run manually or on a schedule: npm run check-links
 */
import { getSources } from "../lib/content";

async function main() {
  const sources = getSources();
  let failures = 0;
  for (const s of sources) {
    try {
      const res = await fetch(s.url, {
        method: "GET",
        redirect: "follow",
        headers: { "User-Agent": "Mozilla/5.0 (ExpatsBuddy link checker)" },
        signal: AbortSignal.timeout(20000),
      });
      const ok = res.ok;
      console.log(`${ok ? "✓" : "✗"} ${res.status}  ${s.id}  ${s.url}`);
      if (!ok) failures++;
    } catch (err) {
      console.log(`✗ ERR  ${s.id}  ${s.url}  (${(err as Error).message})`);
      failures++;
    }
  }
  console.log(`\n${sources.length - failures}/${sources.length} sources reachable.`);
  if (failures > 0) process.exit(1);
}

main();
