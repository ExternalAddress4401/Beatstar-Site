import { Effect } from "../interfaces/Effect";
import { Size } from "../interfaces/Size";
import { Chart } from "./Chart";

interface BuiltChart {
  id: number;
  interactions_id: string;
  notes: BytesNote[];
  sections: BuiltSection[];
  perfectSizes: BuiltSize[];
  speeds: BuiltSize[];
  effects: BuiltEffect[];
}

interface BuiltSection {
  offset: number;
}

interface BuiltSize {
  offset: number;
  multiplier: number;
}

interface BuiltEffect {
  offset: number;
  effects: number[];
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
  const directions = ["u", "d", "l", "r", "ul", "ur", "dr", "dl"];

  const resolution = chart.resolution;

  const finalChart: BuiltChart = {
    id: 508,
    interactions_id: "77-1",
    notes: [],
    sections: chart.sections.map((section) => {
      return { offset: section.adjustedOffset / resolution };
    }),
    perfectSizes: chart.perfectSizes.map((perfectSize) => {
      return {
        ...(perfectSize.offset !== 0 && {
          offset: perfectSize.adjustedOffset / resolution,
        }),
        multiplier: perfectSize.multiplier,
      };
    }),
    speeds: chart.speeds.map((speed) => {
      return {
        ...(speed.offset !== 0 && {
          offset: speed.adjustedOffset / resolution,
        }),
        multiplier: speed.multiplier,
      };
    }),
    effects: chart.effects.map((effect) => {
      return {
        offset: effect.adjustedOffset / resolution,
        effects: effect.effects,
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
            lane: s.lane + 1,
          })),
          ...(note.swipe && { swipe: directions.indexOf(note.swipe) + 1 }),
        },
        lane: note.lane + 1,
        ...(note.size && { size: note.size }),
      });
    }
  }

  return finalChart;
}
