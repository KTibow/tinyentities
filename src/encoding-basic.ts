export const getEntity = (text: string) =>
  `&#x${text.codePointAt(0)?.toString(16)};`;
