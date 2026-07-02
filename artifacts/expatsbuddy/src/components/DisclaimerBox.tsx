const DEFAULT_TEXT =
  "ExpatsBuddy provides general educational information and links to official sources. It does not provide legal, medical, tax, immigration, benefits, or insurance advice.";

export function DisclaimerBox({ text = DEFAULT_TEXT }: { text?: string }) {
  return (
    <aside
      role="note"
      className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
      {text}
    </aside>
  );
}

export function PageScopeBox({ items }: { items: string[] }) {
  return (
    <section
      aria-labelledby="page-cannot-do"
      className="rounded-lg border border-slate-200 bg-slate-100 px-5 py-4"
    >
      <h2 id="page-cannot-do" className="text-sm font-semibold text-slate-700">
        What this page does not do
      </h2>
      <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
        {items.map((item) => (
          <li key={item} className="mt-1">{item}</li>
        ))}
      </ul>
    </section>
  );
}
