import { roundToPlaces } from "../utils/roundToPlaces";
import { Chart } from "./ChartReader";
import { effects } from "./Effects";

export function writeChart(chart: Chart) {
  let chartString = `[Song]\r\n{\r\n  Offset = 0\r\n  Resolution = 192\r\n  Player2 = bass\r\n  Difficulty = 0\r\n  PreviewStart = 0\r\n  PreviewEnd = 0\r\n  Genre = "rock"\r\n  MediaType = "cd"\r\n}\r\n`;
  chartString += `[SyncTrack]\r\n{\r\n  0 = TS 4\r\n  0 = B 120000\r\n}\r\n`;
  chartString += `[Events]\r\n{\r\n`;

  //sections
  for (var i = 0; i < chart.sections.length; i++) {
    const section = chart.sections[i];
    chartString += `  ${section} = E "section stage${i + 1}"\r\n`;
  }
  for (const offset in chart.effects) {
    for (const effect of chart.effects[offset]) {
      chartString += `  ${offset} = E ${
        effects.find((el) => el.id === effect).idLabel
      }\r\n`;
    }
  }
  chartString += "}\r\n[ExpertSingle]\r\n{\r\n";

  for (const note of chart.notes) {
    if (note.switches) {
      chartString += `  ${note.offset} = N ${note.lane - 1} ${note.length}\r\n`;
      for (const s of note.switches) {
        chartString += `  ${s.offset} = E h${note.lane}>${s.lane}\r\n`;
      }
    } else {
      chartString += `  ${note.offset} = N ${note.lane - 1} ${note.length}\r\n`;
      if (note.swipe) {
        chartString += `  ${
          note.length ? note.offset + note.length : note.offset
        } = E ${note.swipe}${note.lane}\r\n`;
      }
      if (note.size) {
        chartString += `  ${note.offset} = E /${note.size}\r\n`;
      }
    }
  }

  for (const perfectSize of chart.perfectSizes) {
    const size = roundToPlaces(perfectSize.multiplier, 2)
      .toString()
      .replace(".", "");
    chartString += `  ${perfectSize.offset} = E p${size}\r\n`;
  }

  for (const speed of chart.speeds) {
    const spd = roundToPlaces(speed.multiplier, 2).toString().replace(".", "");
    chartString += `  ${speed.offset} = E s${spd}\r\n`;
  }

  chartString += "}";

  return chartString;
}
