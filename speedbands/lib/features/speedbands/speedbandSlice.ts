import { createAppAsyncThunk } from "@/lib/store";
import { createSlice } from "@reduxjs/toolkit";

interface SpeedbandState {
  speedbands: {};
}

export const speedbandSlice = createSlice({
  name: "Speedbands",
  initialState: {
    speedbands: [],
    selectedSpeedbands: [],
    loading: false,
  },
  reducers: {

  }
})

export const fetchSpeedbands = createAppAsyncThunk('posts/fetchPosts', async () => {
  const response = await fetch("./");
  const data = await response.json();

  return data;
})

export default speedbandSlice.reducer