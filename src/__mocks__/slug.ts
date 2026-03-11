export default function slug(value: string, options?: { lower?: boolean }) {
  const normalized = String(value ?? '').trim().replace(/\s+/g, '-');
  return options?.lower ? normalized.toLowerCase() : normalized;
}
