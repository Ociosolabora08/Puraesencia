// Pura Esencia vende en pesos colombianos: enteros, sin decimales.
// Única fuente de verdad de formato de precios (bug auditoría: USD vs COP mezclados).
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
