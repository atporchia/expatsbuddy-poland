import { useEffect, useState } from "react";
import { getInstitutionById } from "@/lib/content";
import type { Institution } from "@/lib/types";

export function InstitutionBadge({ id }: { id: string }) {
  const [institution, setInstitution] = useState<Institution | undefined>();

  useEffect(() => {
    getInstitutionById(id).then(setInstitution).catch(() => {});
  }, [id]);

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
  return (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((id) => (
        <InstitutionBadge key={id} id={id} />
      ))}
    </div>
  );
}
