import { Chart, Effect, Size } from "./ChartReader";

interface BuiltChart {
  id: number;
  interactions_id: string;
  notes: BytesNote[];
  sections: BuiltSection[];
  perfectSizes: Size[];
  speeds: Size[];
  effects: Effect[];
}

interface BuiltSection {
  offset: number;
}

export interface BytesNote {
  note_type: number;
  single?: {
    note: {
      offset: number;
      lane: number;
    };
  };
  long?: {
    note: {
      offset: number;
      lane: number;
    }[];
  };
  note?: {
    switchHold: {
      offset: number;
      lane: number;
    }[];
  };
  lane: number;
}

export function buildChart(chart: Chart) {
  const directions = ["u", "d", "l", "r", "ul", "ur", "dl", "dr"];
  const resolution = chart.info.resolution;

  const finalChart: BuiltChart = {
    id: 508,
    interactions_id: "77-1",
    notes: [],
    sections: chart.sections.map((section) => {
      return { offset: section / resolution };
    }),
    perfectSizes: chart.perfectSizes.map((perfectSize) => {
      return {
        ...perfectSize,
        offset: perfectSize.offset / resolution,
      };
    }),
    speeds: chart.speeds.map((speed) => {
      return {
        ...speed,
        offset: speed.offset / resolution,
      };
    }),
    effects: Object.entries(chart.effects).map((effect) => {
      return {
        offset: parseFloat(effect[0]) / resolution,
        effects: effect[1],
      };
    }),
  };

  for (const note of chart.notes) {
    const noteType = note.switches ? 5 : note.length === 0 ? 1 : 2;
    if (noteType === 1) {
      finalChart.notes.push({
        note_type: 1,
        single: {
          note: {
            offset: note.offset / resolution,
            lane: note.lane + 1,
          },
          ...(note.swipe && { swipe: directions.indexOf(note.swipe) + 1 }),
        },
        lane: note.lane + 1,
        ...(note.size && { size: note.size }),
      });
    } else if (noteType === 2) {
      finalChart.notes.push({
        note_type: 2,
        long: {
          note: [
            {
              offset: note.offset / resolution,
              lane: note.lane + 1,
            },
            {
              offset: (note.offset + note.length) / resolution,
              lane: note.lane + 1,
            },
          ],
          ...(note.swipe && { swipe: directions.indexOf(note.swipe) + 1 }),
        },
        lane: note.lane + 1,
        ...(note.size && { size: note.size }),
      });
    } else if (noteType === 5) {
      finalChart.notes.push({
        note_type: 5,
        note: {
          switchHold: note.switches.map((s) => ({
            offset: s.offset / resolution,
            lane: s.lane,
          })),
        },
        lane: note.lane + 1,
        ...(note.size && { size: note.size }),
      });
    }
  }

  if (!finalChart.perfectSizes.length) {
    finalChart.perfectSizes.push({
      offset: 0,
      multiplier: 1,
    });
  }
  if (!finalChart.speeds.length) {
    finalChart.speeds.push({
      offset: 0,
      multiplier: 1,
    });
  }

  return finalChart;
}
