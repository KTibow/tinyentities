import { encodeHierarchy } from "./resources/map.ts";

export const getEntity = (char: string) => {
  if (char.length < 1) return undefined;

  const c1 = char.charCodeAt(0);
  const level1 = encodeHierarchy.get(c1);
  if (!level1) return undefined;

  const c2 = char.length < 2 ? 0 : char.charCodeAt(1);
  return level1.get(c2);
};
