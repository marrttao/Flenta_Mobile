export function parseDeadline(value: string) {
  if (!value.trim()) return null;
  const text = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || !Number.isFinite(Date.parse(text)) || new Date(text).toISOString().slice(0, 10) !== text) {
    throw new Error('Дата має бути у форматі YYYY-MM-DD.');
  }
  return text;
}
export function localDate(value = new Date()) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
}
