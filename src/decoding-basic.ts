export const getChar = (entity: string) => {
  if (entity.startsWith("&#x") || entity.startsWith("&#X")) {
    const code = parseInt(entity.slice(3, -1), 16);
    return String.fromCodePoint(code);
  }
  if (entity.startsWith("&#")) {
    const code = parseInt(entity.slice(2, -1));
    return String.fromCodePoint(code);
  }
};
