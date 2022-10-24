import { Chart } from "./ChartReader";

export function getMaxScore(chart: Chart, difficulty: number) {
  let score = 0;

  //hold swipes count as extra notes
  const noteLength =
    chart.notes.length +
    chart.notes.filter((note) => note.length && note.swipe).length;

  score += noteLength >= 10 ? 10 * 250 : noteLength * 250;

  if (noteLength > 25) {
    score += noteLength >= 25 ? (25 - 10) * 500 : (noteLength - 10) * 500;
  }

  switch (difficulty) {
    case 4:
      if (noteLength > 25) score += (noteLength - 25) * 750;
      break;
    case 3:
      if (noteLength > 25) {
        score += noteLength >= 50 ? (50 - 25) * 750 : (noteLength - 25) * 750;
      }
      if (noteLength > 50) {
        score += (noteLength - 50) * 1000;
      }
      break;
    case 1:
      if (noteLength > 25) {
        score += noteLength >= 50 ? (50 - 25) * 750 : (noteLength - 25) * 750;
      }
      if (noteLength > 50) {
        score +=
          noteLength > 100 ? (100 - 50) * 1000 : (noteLength - 50) * 1000;
      }
      if (noteLength > 100) {
        score += (noteLength - 100) * 1250;
      }
      break;
  }

  const holdTickCount = chart.notes.reduce(function (prev, note) {
    return note.length === 0
      ? 0
      : Math.floor(
          Math.floor((note.offset + note.length) / chart.info.resolution) -
            Math.floor(note.offset / chart.info.resolution)
        );
  }, 0);

  score += holdTickCount * (250 * 0.2);

  return score;
}
