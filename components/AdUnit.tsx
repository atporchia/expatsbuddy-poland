"use client";

import { useEffect, useState } from "react";
import { getDict } from "@/lib/i18n";
import {
  type Consent,
  CONSENT_CHANGE_EVENT,
  getStoredConsent,
} from "@/lib/consent";

const AD_CLIENT = "ca-pub-4964109306080105";
const AD_SLOT = "9899291885";

export function AdUnit({ locale }: { locale: string }) {
  const t = getDict(locale).ads;
  const [consent, setConsent] = useState<Consent | null>(null);

  useEffect(() => {
    // Same SSR/hydration constraint as CookieConsent: localStorage is only
    // readable after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(getStoredConsent());

    function onChange(event: Event) {
      setConsent((event as CustomEvent<Consent>).detail);
    }
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
  }, []);

  useEffect(() => {
    if (consent !== "accepted") return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle.js may not have finished loading yet; it processes
      // queued <ins> elements once it initializes, so this is safe to ignore.
    }
  }, [consent]);

  if (consent !== "accepted") return null;

  return (
    <div className="border-t border-slate-100 pt-6">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
        {t.label}
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
