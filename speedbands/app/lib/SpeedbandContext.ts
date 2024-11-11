"use client"

import { createContext, Dispatch } from "react";
import { Speedband } from "./speedband";

export interface SpeedbandState {
  speedbands: Array<Speedband>;
  status: 'pending' | 'idle' | 'loading';
  selectedSpeedbands: Speedband[];
}

export type SpeedbandActionType =
  | {
    type: 'SpeedbandsAdded' | 'SpeedbandClicked' | 'SetSelectedSpeedbands';
    speedbands: Array<Speedband>;
  }

export const initialSpeedbandState: SpeedbandState = {
  speedbands: [],
  status: 'pending',
  selectedSpeedbands: [],
}

export const SpeedbandContext = createContext<SpeedbandState>(initialSpeedbandState);
export const SpeedbandDispatchContext = createContext<Dispatch<SpeedbandActionType>>((_) => { });

export function speedbandReducer(state: SpeedbandState, action: SpeedbandActionType): SpeedbandState {
  switch (action.type) {
    case 'SpeedbandsAdded': {
      return {
        ...state,
        speedbands: action.speedbands,
        status: 'idle',
      } as SpeedbandState
    }
    case 'SpeedbandClicked': {
      let i = action.speedbands[0];
      let selected = state.selectedSpeedbands;
      return {
        ...state,
        selectedSpeedbands: selected.includes(i) ? selected.filter(cmp => cmp != i) : [...selected, i],
      }
    }
    case 'SetSelectedSpeedbands': {
      return {
        ...state,
        selectedSpeedbands: action.speedbands,
      }
    }
    default: {
      return state
    }
  }
}