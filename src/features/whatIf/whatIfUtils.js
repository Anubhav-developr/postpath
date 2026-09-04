export function projectValue(startValue, offset) {
  const start = Number(startValue);
  const delta = Number(offset || 0);

  if (!Number.isFinite(start)) {
    return null;
  }

  return start + delta;
}
