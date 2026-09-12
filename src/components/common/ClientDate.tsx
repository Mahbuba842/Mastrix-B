import { useEffect, useState } from "react";

export function ClientDate({
  date,
  options,
  className,
}: {
  date: string | number | Date;
  options?: Intl.DateTimeFormatOptions | undefined;
  className?: string | undefined;
}) {
  const [formatted, setFormatted] = useState<string>(() => {
    // Stable ISO string for SSR/first paint to avoid hydration mismatch.
    const d = typeof date === "object" ? date : new Date(date);
    try {
      return d.toISOString().replace("T", " ").slice(0, 19);
    } catch {
      return String(date);
    }
  });

  useEffect(() => {
    const d = typeof date === "object" ? date : new Date(date);
    setFormatted(
      d.toLocaleString("en-IN", {
        dateStyle: "short",
        timeStyle: "medium",
        ...options,
      }),
    );
  }, [date, options]);

  return <span className={className}>{formatted}</span>;
}

export function ClientTime({
  date,
  className,
}: {
  date: string | number | Date;
  className?: string;
}) {
  return <ClientDate date={date} options={{ timeStyle: "short" }} className={className} />;
}
