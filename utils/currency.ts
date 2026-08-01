/**
  Formats a numeric amount into localized currency string (default USD).
 */
export function formatCurrency(amount: number, currency = "USD", locale = "en-US"): string {
  if (isNaN(amount)) return "$0.00";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
