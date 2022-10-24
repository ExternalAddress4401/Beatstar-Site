export const roundToPlaces = (number: number, places: number) => {
  places = 10 ** places;
  const res = Math.round(number * places) / places;
  return res;
};
