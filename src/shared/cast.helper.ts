export function trim(value: string): string {
  return value.trim();
}

export function toDate(value: string): Date {
  return new Date(value);
}

export function toBoolean(value: string): boolean {
  value = value.toLowerCase();

  return !!(value === 'true' || value === '1');
}

export function toNumber(value: string): number {
  const newValue: number = Number.parseInt(value, 10);

  return newValue;
}

export function toStringArray(value: string | string[] | undefined): string[] {
  const { isArray } = Array;
  const isString = n => typeof n === 'string';
  if (!value) {
    return [];
  }

  if (!!isArray(value)) {
    return value;
  }

  if (!!isString(value)) {
    return [value];
  }
}
