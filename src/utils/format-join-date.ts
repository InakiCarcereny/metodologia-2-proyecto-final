const MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

export function formatJoinDate(date: Date): string {
  return `${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
}
