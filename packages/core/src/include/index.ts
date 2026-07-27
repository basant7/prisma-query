export function parseInclude(
  params: Record<string, string>,
  includeable: string[],
): Record<string, boolean | object> | undefined {
  const includeParam = params['include'];
  if (!includeParam || includeable.length === 0) return undefined;

  const includeableSet = new Set(includeable);
  const fields = includeParam.split(',').map((f) => f.trim());
  const include: Record<string, boolean | object> = {};

  for (const field of fields) {
    if (field && includeableSet.has(field)) {
      include[field] = true;
    }
  }

  return Object.keys(include).length > 0 ? include : undefined;
}

export function buildPrismaInclude(
  include: Record<string, boolean | object> | undefined,
): Record<string, boolean | object> | undefined {
  return include;
}
