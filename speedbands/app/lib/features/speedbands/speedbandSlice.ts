import { Speedband } from "@/lib/speedband";
import { AppDispatch, RootState } from "@/lib/store";
import { createSlice } from "@reduxjs/toolkit";

export interface SpeedbandState {
  speedbands: Array<Speedband>;
  selectedStates: Map<string, boolean>;
  status: 'idle' | 'pending' | 'success' | 'failure';
}

const initialState = {
  speedbands: [],
  selectedStates: new Map<string, boolean>(),
  status: 'idle',
}

export const speedbandSlice = createSlice({
  name: "Speedbands",
  initialState: initialState,
  reducers: {
    setSpeedbands: (state, action) => {
      state.speedbands = action.payload;
      state.status = 'success';
    },
  }
})

// BROKEN RN
// export const fetchSpeedbands = () => {
//   return async (dispatch: AppDispatch, getState: RootState) => {
//     console.log("ATTEMPTING FETCH");
//     if (getState.speedband.status == 'idle') {
//       console.log("FETCHING");
//       fetch("https://raw.githubusercontent.com/willbowden/iUROP-live-speedband-tool/refs/heads/main/data/viable_markers.json").then((res) => res.json().then(obj => {
//         dispatch(setSpeedbands(Speedband.jsonToSpeedbands(obj)));
//       }));
//     }
//   }
// }

export const getSpeedbands = (state: RootState): Array<Speedband> => {
  if (state.speedband.status == 'success') {
    return state.speedband.speedbands;
  } else {
    return [];
  }
};

export const { setSpeedbands } = speedbandSlice.actions;

export default speedbandSlice.reducer