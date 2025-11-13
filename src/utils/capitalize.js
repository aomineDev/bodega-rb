export const capitalize = (str) =>
  str
    .split(' ')
    .map((str) => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase())
    .join(' ')
    .trim()
