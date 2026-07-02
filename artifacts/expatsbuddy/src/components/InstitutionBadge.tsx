import { useEffect, useState } from "react";
import type { Institution } from "@/lib/types";
import { getInstitutions } from "@/lib/content";

let institutionMap: Map<string, Institution> | null = null;

export function useInstitutions() {
  const [map, setMap] = useState<Map<string, Institution>>(new Map());
  useEffect(() => {
    if (institutionMap) { setMap(institutionMap); return; }
    getInstitutions().then((list) => {
      institutionMap = new Map(list.map((i) => [i.id, i]));
      setMap(institutionMap);
    });
  }, []);
  return map;
}

export function InstitutionBadge({ id, institutions }: { id: string; institutions: Map<string, Institution> }) {
  const institution = institutions.get(id);
  const label = institution?.shortName ?? id;
  return (
    <span
      title={institution?.name}
      className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-800"
    >
      {label}
    </span>
  );
}

export function InstitutionList({ ids }: { ids: string[] }) {
  const institutions = useInstitutions();
  return (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((id) => (
        <InstitutionBadge key={id} id={id} institutions={institutions} />
      ))}
    </div>
  );
}
