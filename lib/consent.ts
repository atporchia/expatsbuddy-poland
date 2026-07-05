export const CONSENT_STORAGE_KEY = "expatsbuddy-cookie-consent";
export const CONSENT_CHANGE_EVENT = "expatsbuddy-consent-change";

export type Consent = "accepted" | "declined";

export function getStoredConsent(): Consent | null {
  return window.localStorage.getItem(CONSENT_STORAGE_KEY) as Consent | null;
}

export function setStoredConsent(value: Consent) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  window.dispatchEvent(
    new CustomEvent<Consent>(CONSENT_CHANGE_EVENT, { detail: value }),
  );
}
