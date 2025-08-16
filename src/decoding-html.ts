import { decodeMap } from "./resources/map.ts";

export const getValue = (entity: string) => decodeMap[entity];
