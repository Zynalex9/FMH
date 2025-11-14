import { supabase } from "@/lib/supabaseClient";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export interface IUser {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  is_active?: boolean;
  phone?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  skills?: string;
  availability?: string;
  for_events?: boolean;
  for_outreachs?: boolean;
  metadata?: {
    email?: string;
    email_verified?: boolean;
    phone?: string;
    phone_verified?: boolean;
    full_name?: string;
    role?: string;
    skills?: string;
    availability?: string;
    is_active?: boolean;
    for_events?: boolean;
    for_outreachs?: boolean;
    [key: string]: unknown;
  };
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

/**
 * ✅ Get user info directly from Supabase session
 * No DB fetch — all data comes from `auth.session.user`
 */
export const getUser = createAsyncThunk<IUser | null>(
  "user/getUser",
  async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;
    if (!session) return null; // no logged-in user

    const user = session.user;

    // Extract what you need from the session user object
    return {
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata?.full_name || "",
      role: user.user_metadata?.role || "user",
      is_active: user.user_metadata?.is_active ?? true,
      metadata: user.user_metadata,
    } as IUser;
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
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch session";
      });
  },
});

export const { handleUserLogout } = userSlice.actions;
export default userSlice.reducer;
