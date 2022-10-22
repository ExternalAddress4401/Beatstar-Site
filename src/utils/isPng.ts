export const isPng = (data: Uint8Array) => {
  const header = [137, 80, 78, 71, 13, 10, 26, 10];
  for (var i = 0; i < 8; i++) {
    if (data[i] != header[i]) {
      return false;
    }
  }
  return true;
};
