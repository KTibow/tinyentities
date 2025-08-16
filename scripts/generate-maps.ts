import entitiesRaw from "./entities.json" with { type: "json" };

// Generate a hierarchy where each level is a character code
const hierarchyMultiple: Record<string, Record<string, string[]>> = {};
for (const [entity, { characters }] of Object.entries(entitiesRaw)) {
  const firstLevel = characters.charCodeAt(0);
  const secondLevel =
    characters.length == 1 ? "0" : characters.charCodeAt(1).toString();
  hierarchyMultiple[firstLevel] ||= {};
  hierarchyMultiple[firstLevel][secondLevel] ||= [];
  hierarchyMultiple[firstLevel][secondLevel].push(entity);
}

type Uncompressed = { index: number; value: string }[];
const compressWithDeltas = (
  arr: Uncompressed,
  separator: string,
  subseparator?: string,
) => {
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
const iterateMapping = <T>(mapping: Record<string, T>) =>
  Object.entries(mapping).map(([k, v]) => [+k, v] as const);

const additionalEncodeCases: Record<string, string> = {};
const stripEntity = (code: string) => {
  if (code.startsWith("&") && code.endsWith(";")) {
    return code.slice(1, -1);
  }
  // TODO
  return "";
};

// Generate mapping
const firstLevel: Uncompressed = [];
for (const [code, entities] of iterateMapping(hierarchyMultiple)) {
  const secondLevel: Uncompressed = [];

  for (const [subcode, entityOptions] of iterateMapping(entities)) {
    for (const entity of entityOptions) {
      const stripped = stripEntity(entity);
      if (!stripped) continue;
      secondLevel.push({ index: subcode, value: stripped });
    }
  }

  if (!secondLevel.length) continue;

  // Separate each second level entry (instance of entity) with the character ">"
  firstLevel.push({ index: code, value: compressWithDeltas(secondLevel, ">") });
}

// Separate each first level entry (character that starts entities) with a linebreak
const output = compressWithDeltas(firstLevel, "\n", ">");
console.log(output);
