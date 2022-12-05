export const insertAt = (str: string, char: string, index: number) => {
  return str.substring(0, index) + char + str.substring(index);
};
