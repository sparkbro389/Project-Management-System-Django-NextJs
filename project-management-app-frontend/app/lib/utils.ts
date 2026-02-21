export function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateISO: string) {
  const d = new Date(dateISO);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function clampText(text: string, max = 80) {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}
