export function parseAmount(value: string) {
  const text = value.trim().replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(text)) throw new Error('Вкажи суму з точністю до двох знаків.');
  const amount = Number(text);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 10_000_000_000) throw new Error('Сума має бути більшою за нуль та не перевищувати 10 000 000 000.');
  return amount;
}
export function money(value: number, currency: string) { return `${value.toFixed(2)} ${currency}`; }
