function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function toDateTimeLocalValue(value: string | null,): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return [
    date.getFullYear(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    'T',
    pad(date.getHours()),
    ':',
    pad(date.getMinutes()),
  ].join('');
}

export function toIsoDateTime(value: string,): string | undefined {
  if (!value) {
    return undefined;
  }

  return new Date(value).toISOString();
}