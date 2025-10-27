import { supabase } from "@/lib/supabaseClient";
import { Role } from "@/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface IUser {
  id: string;
  email: string;
  phone: string;
  full_name?: string;
  role: Role;
  zone: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
interface InitialState {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: InitialState = {
  user: null,
  isLoading: false,
  error: null,
};
export const getUser = createAsyncThunk<IUser | null>(
  "user/getUser",
  async () => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw authError;

    if (user) {
      const { data: profile, error } = await supabase.from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return profile as IUser;
    }

    return null;
  }
);

const userSlice = createSlice({
  name: "UserSlice",
  initialState,
  reducers: {
    handleUserLogout(state) {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch user";
    });
  },
});

export const { handleUserLogout } = userSlice.actions;
export default userSlice.reducer;
