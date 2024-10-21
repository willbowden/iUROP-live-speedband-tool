import { createAppAsyncThunk } from "@/lib/store";
import { createSlice } from "@reduxjs/toolkit";

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
  const response = await fetch("./")
  return response.data
})

export default speedbandSlice.reducer