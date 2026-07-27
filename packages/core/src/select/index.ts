export function parseSelect(
  params: Record<string, string>,
  selectable: string[],
): Record<string, boolean> | undefined {
  const fieldsParam = params['fields'];
  if (!fieldsParam || selectable.length === 0) return undefined;

  const selectableSet = new Set(selectable);
  const fields = fieldsParam.split(',').map((f) => f.trim());
  const select: Record<string, boolean> = {};

  for (const field of fields) {
    if (field && selectableSet.has(field)) {
      select[field] = true;
    }
  }

  return Object.keys(select).length > 0 ? select : undefined;
}

export function buildPrismaSelect(
  select: Record<string, boolean> | undefined,
): Record<string, boolean> | undefined {
  return select;
}
