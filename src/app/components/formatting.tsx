export const toPascalCaseWithSpaces = (str: any) => {
  const dateTimeRegex = /\b(?:AM|PM)\b/;

  if (dateTimeRegex.test(str)) {
    return str.replace(dateTimeRegex, (match: any) => match.toUpperCase());
  }
  else if (typeof str !== "string") {
    return str;
  }

  return str
    .toLowerCase()
    .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
};
