import { Direction } from "./Direction";

export interface Note {
  offset: number;
  length: number;
  lane: number;
  swipe?: Direction;
  size?: number;
  adjustedStart?: number;
  adjustedEnd?: number;
  switches?: {
    offset: number;
    lane: number;
  }[];
}
