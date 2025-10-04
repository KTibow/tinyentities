export type Unpacked = { index: number; value: string }[];
export const pack = (arr: Unpacked, separator: string, subseparator = "") => {
  arr.sort((a, b) => a.index - b.index);
  let output = "";
  let arrIndex = 0;
  let lastIndex = 0;
  for (const { index, value } of arr) {
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
    output += value;

    lastIndex = index;
    arrIndex++;
  }
  return output;
};
export const unpack = (
  data: string,
  separator: string,
  emit: (data: { index: number; value: string }) => void,
) => {
  let arrIndex = 0;
  let index = 0;
  for (let value of data.split(separator)) {
    if (!value) continue;

    let increment: number;
    if ("0123456789".includes(value[0])) {
      increment = parseInt(value, 10);
      value = value.slice(increment.toString().length);
    } else {
      increment = arrIndex == 0 ? 0 : 1;
    }
    index += increment;

    emit({ index, value });

    arrIndex++;
  }
};
