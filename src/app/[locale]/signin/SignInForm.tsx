"use client";

import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import Link from "next/link";

type FormData = {
  emailOrPhone: string;
  password: string;
};

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const input = data.emailOrPhone.trim();

    const isEmail = /\S+@\S+\.\S+/.test(input);
    const isPhone = /^[0-9+\-()\s]*$/.test(input);

    if (!isEmail && !isPhone) {
      toast.error("Please enter a valid email or phone number.");
      return;
    }

    try {
      let response;

      if (isEmail) {
        response = await supabase.auth.signInWithPassword({
          email: input,
          password: data.password,
        });
      } else {
        response = await supabase.auth.signInWithPassword({
          phone: input,
          password: data.password,
        });
      }

      const { error, data: userData } = response;

      if (error) {
        console.error("Sign-in error:", error);
        toast.error(error.message || "Sign-in failed");
        return;
      }

      console.log("User signed in:", userData);
      toast.success("Signed in successfully ✅");
    } catch (error) {
      console.error("Unexpected sign-in error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl p-6 w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center mb-2">Sign In</h2>

        {/* Email or Phone */}
        <div>
          <input
            type="text"
            placeholder="Email or Phone"
            {...register("emailOrPhone", {
              required: "Please enter your email or phone number",
            })}
            className="w-full bg-sgreen rounded-lg p-2"
          />
          {errors.emailOrPhone && (
            <p className="text-red-500 text-sm mt-1">
              {errors.emailOrPhone.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
            })}
            className="w-full bg-sgreen rounded-lg p-2"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-cgreen text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
        <p className="text-center">New to FMH? <Link href="/en/signup" className="text-cgreen">Sign Up</Link></p>
      </form>
    </div>
  );
}
