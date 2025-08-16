export type Unpacked = { index: number; value: string }[];
export const pack = (
  arr: Unpacked,
  separator: string,
  {
    isEntity = false,
    subseparator = "",
  }: { isEntity?: boolean; subseparator?: string } = {},
) => {
  arr.sort((a, b) => a.index - b.index);
  let output = "";
  let arrIndex = 0;
  let lastIndex = 0;
  let excludedValues = new Set();
  for (const { index, value } of arr) {
    if (excludedValues.has(value)) continue;

    // Starting a new item requires a separator
    if (arrIndex > 0) output += separator;
    // and an increment
    const assumedIncrement = arrIndex == 0 ? 0 : 1;
    if (index - lastIndex != assumedIncrement) output += index - lastIndex;
    // and sometimes a subseparator, to prevent the inner from being eaten
    if (subseparator && "0123456789".includes(value[0])) {
      output += subseparator;
    }
    // Now, add the value
    if (isEntity) {
      if (value.endsWith(";")) {
        output += value.slice(1, -1);
      } else {
        excludedValues.add(value + ";");
        output += value.slice(1) + "!";
      }
    } else {
      output += value;
    }

    lastIndex = index;
    arrIndex++;
  }
  return output;
};
export const unpack = (data: string, separator: string, isEntity = false) => {
  const output: Unpacked = [];
  let arrIndex = 0;
  let index = 0;
  for (let value of data.split(separator)) {
    if (!value) continue;

    const explicitIncrement = parseInt(value);
    let increment: number;
    if (Number.isNaN(explicitIncrement)) {
      increment = arrIndex == 0 ? 0 : 1;
    } else {
      increment = explicitIncrement;
      value = value.slice(increment.toString().length);
    }
    index += increment;

    const add = (value: string) => output.push({ index, value });

    if (isEntity) {
      if (value.endsWith("!")) {
        add(`&${value.slice(0, -1)};`);
        add(`&${value.slice(0, -1)}`);
      } else {
        add(`&${value};`);
      }
    } else {
      add(value);
    }

    arrIndex++;
  }
  return output;
};
