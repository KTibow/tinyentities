import { decodeMap } from "./resources/map.ts";

export const getChar = (char: string) => decodeMap[char];
