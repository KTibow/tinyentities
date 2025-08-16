export const getEntity = (char: string) =>
  `&#x${char.codePointAt(0)?.toString(16)};`;
