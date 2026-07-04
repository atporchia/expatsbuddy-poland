"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getDict } from "@/lib/i18n";

const STORAGE_KEY = "expatsbuddy-cookie-consent";
const REOPEN_EVENT = "expatsbuddy-open-cookie-settings";
type Consent = "accepted" | "declined";

export function CookieConsent({ locale }: { locale: string }) {
  const t = getDict(locale).cookies;
  const [consent, setConsent] = useState<Consent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Reading localStorage must happen after mount to avoid an SSR/client
    // hydration mismatch (the server has no access to it), so this can't
    // be done via lazy useState initializers instead.
    const stored = window.localStorage.getItem(STORAGE_KEY) as Consent | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(stored);
    setVisible(stored !== "accepted" && stored !== "declined");

    function reopen() {
      setVisible(true);
    }
    window.addEventListener(REOPEN_EVENT, reopen);
    return () => window.removeEventListener(REOPEN_EVENT, reopen);
  }, []);

  function choose(value: Consent) {
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
    setVisible(false);
  }

  return (
    <>
      {consent === "accepted" && (
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4964109306080105"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
      {visible && (
        <div
          role="dialog"
          aria-label={t.message}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white px-4 py-4 shadow-[0_-4px_16px_rgba(15,23,42,0.08)]"
        >
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3">
            <p className="flex-1 text-sm text-slate-600">{t.message}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => choose("declined")}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {t.decline}
              </button>
              <button
                type="button"
                onClick={() => choose("accepted")}
                className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {t.accept}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function CookieSettingsLink({ locale }: { locale: string }) {
  const t = getDict(locale).cookies;
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(new Event(REOPEN_EVENT))
      }
      className="hover:text-blue-800"
    >
      {t.settingsLink}
    </button>
  );
}
