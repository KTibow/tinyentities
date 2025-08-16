export const getChar = (entity: string) => {
  if (entity.startsWith("&#x")) {
    const code = parseInt(entity.slice(3, -1), 16);
    return String.fromCharCode(code);
  }
  if (entity.startsWith("&#")) {
    const code = parseInt(entity.slice(2, -1));
    return String.fromCharCode(code);
  }
};
