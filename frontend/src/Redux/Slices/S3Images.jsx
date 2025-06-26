import { createSlice } from "@reduxjs/toolkit";

export const s3Images = createSlice({
  name: "coverImg",
  initialState: {
    s3Keys: [],
    image:''
  },
  reducers: {
    setS3Keys: (state, action) => {
      state.s3Keys = action.payload;
    },
    setImagePath:(state,action)=>{
        state.image=action.payload;
    }
    
  },
});

export const { setS3Keys ,setImagePath} = s3Images.actions;
export default s3Images.reducer;
