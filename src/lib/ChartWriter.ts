import { roundToPlaces } from "../utils/roundToPlaces";
import { Chart } from "./ChartReader";

export function writeChart(chart: Chart) {
  console.log(chart);
  let chartString = `[Song]\n{\n  Offset = 0\n  Resolution = 192\n  Player2 = bass\n  Difficulty = 0\n  PreviewStart = 0\n  PreviewEnd = 0\n  Genre = "rock"\n  MediaType = "cd"\n}\n`;
  chartString += `[SyncTrack]\n{\n  0 = TS 4\n  0 = B 120000\n}\n`;
  chartString += `[Events]\n{\n`;

  //sections
  for (var i = 0; i < chart.sections.length; i++) {
    const section = chart.sections[i];
    chartString += `  ${section} = E "section stage${i + 1}"\n`;
  }
  chartString += "}\n[ExpertSingle]\n{\n";

  for (const note of chart.notes) {
    chartString += `  ${note.offset} = N ${note.lane} ${note.length}\n`;
    if (note.swipe) {
      chartString += `  ${note.offset} = E ${note.swipe}${note.lane + 1}\n`;
    }
  }

  for (const perfectSize of chart.perfectSizes) {
    chartString += `  ${perfectSize.offset} = E p${roundToPlaces(
      perfectSize.multiplier,
      2
    )}\n`;
  }

  for (const speed of chart.speeds) {
    chartString += `  ${speed.offset} = E s${roundToPlaces(
      speed.multiplier,
      2
    )}\n`;
  }

  chartString += "}";

  return chartString;
}
