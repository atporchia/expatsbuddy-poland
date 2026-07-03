export function PageScopeBox({
  items,
  title = "What this page does not do",
}: {
  items: string[];
  title?: string;
}) {
  return (
    <section
      aria-labelledby="page-cannot-do"
      className="rounded-lg border border-slate-200 bg-slate-100 px-5 py-4"
    >
      <h2 id="page-cannot-do" className="text-sm font-semibold text-slate-700">
        {title}
      </h2>
      <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
        {items.map((item) => (
          <li key={item} className="mt-1">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
