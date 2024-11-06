"use client"

import { createContext, Dispatch } from "react";
import { Speedband } from "./speedband";

export interface SpeedbandState {
  speedbands: Array<Speedband>;
  status: 'pending' | 'idle' | 'loading';
}

export type SpeedbandActionType =
  | {
    type: 'Success' | 'NetworkError' | 'Failure';
    speedbands: Array<Speedband>;
  }

export const initialSpeedbandState: SpeedbandState = {
  speedbands: [],
  status: 'pending',
}

export const SpeedbandContext = createContext<SpeedbandState>(initialSpeedbandState);
export const SpeedbandDispatchContext = createContext<Dispatch<SpeedbandActionType>>((_) => { });

export function speedbandReducer(state: SpeedbandState, action: SpeedbandActionType): SpeedbandState {
  console.log(`DISPATCH RECEIVED ${action.speedbands}`)
  switch (action.type) {
    case 'Success': {
      return {
        speedbands: action.speedbands,
        status: 'idle',
      } as SpeedbandState
    }
    default: {
      return state
    }
  }
}