import { hierarchy } from "./resources/map.ts";
const getBestEncoding = (entities: string[]) => {
  if (entities.length < 2) return entities[0];

  let bestEntity = entities[0];
  let bestEntityLength = bestEntity.length;
  let bestEntityUppercases = [...bestEntity].filter(
    (c) => c.toUpperCase() == c,
  ).length;
  for (let i = 1; i < entities.length; i++) {
    const entity = entities[i];
    const entityLength = entity.length;
    const entityUppercases = [...entity].filter(
      (c) => c.toUpperCase() == c,
    ).length;
    if (entityLength > bestEntityLength) continue;
    if (
      entityLength == bestEntityLength &&
      entityUppercases >= bestEntityUppercases
    )
      continue;
    bestEntity = entity;
    bestEntityLength = entityLength;
    bestEntityUppercases = entityUppercases;
  }
  return bestEntity;
};
export const encodeEntity = (text: string): string | undefined => {
  if (text.length < 1) return undefined;

  const c1 = text.charCodeAt(0);
  const level1 = hierarchy.get(c1);
  if (!level1) return undefined;

  const c2 = text.length < 2 ? 0 : text.charCodeAt(1);
  const level2 = level1.get(c2);
  if (!level2) return undefined;
  return getBestEncoding(level2);
};
