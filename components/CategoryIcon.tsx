type IconProps = { className?: string };

function IconBase({
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const ICONS: Record<string, (props: IconProps) => React.JSX.Element> = {
  "business-self-employment": (p) => (
    <IconBase {...p}>
      <path d="M4 9.5 5 4h14l1 5.5" />
      <path d="M4.5 9.5c.4 1.4 1.6 2.3 3 2.3s2.6-.9 3-2.3c.4 1.4 1.6 2.3 3 2.3s2.6-.9 3-2.3c.4 1.4 1.6 2.3 3 2.3" />
      <path d="M5.5 11.5V20h13v-8.5" />
      <path d="M9.5 20v-5.5h5V20" />
    </IconBase>
  ),
  "hospitalization-insurance": (p) => (
    <IconBase {...p}>
      <path d="M12 3.5 18.5 6v5.2c0 4.6-3 7.7-6.5 8.8-3.5-1.1-6.5-4.2-6.5-8.8V6L12 3.5z" />
      <path d="M12 9v6M9 12h6" />
    </IconBase>
  ),
  "official-documents": (p) => (
    <IconBase {...p}>
      <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
      <path d="M14 3.5V8h4.5" />
      <path d="M9 13h6M9 16.5h4" />
    </IconBase>
  ),
  "residence-trc": (p) => (
    <IconBase {...p}>
      <rect x="3.5" y="6" width="17" height="12" rx="1.6" />
      <circle cx="8" cy="12" r="1.8" />
      <path d="M12.5 10.3h5M12.5 13.7h3.5" />
    </IconBase>
  ),
  "sickness-sick-leave": (p) => (
    <IconBase {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M7 12h2.2l1.3-3 2 6 1.3-3H17" />
    </IconBase>
  ),
  "work-job-loss": (p) => (
    <IconBase {...p}>
      <rect x="3.5" y="8" width="17" height="11" rx="1.6" />
      <path d="M8.5 8V6.3a1.6 1.6 0 0 1 1.6-1.6h3.8a1.6 1.6 0 0 1 1.6 1.6V8" />
      <path d="M3.5 13h17" />
    </IconBase>
  ),
};

export function CategoryIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const Icon = ICONS[slug];
  if (!Icon) return null;
  return <Icon className={className} />;
}

export function StartIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.6 9.4l-1.8 5.3-5.3 1.7 1.8-5.3z" />
    </IconBase>
  );
}
