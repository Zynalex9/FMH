"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

type SignUpData = {
  full_name: string;
  contact_info: string;
  zone?: string;
  password: string;
};

export default function UserSignUpForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpData>();

  const onSubmit = async (data: SignUpData) => {
    const isEmail = data.contact_info.includes("@");
    let signUpResponse;

    try {
      if (isEmail) {
        signUpResponse = await supabase.auth.signUp({
          email: data.contact_info,
          password: data.password,
          options: {
            data: {
              full_name: data.full_name?.trim() || null,
              phone: null,
              role: "user",
              is_active: false,
              email: data.contact_info,
            },
          },
        });
      } else {
        signUpResponse = await supabase.auth.signUp({
          phone: data.contact_info,
          password: data.password,
          options: {
            data: {
              full_name: data.full_name?.trim() || null,
              email: "",
              zone: data.zone?.trim() || null,
              role: "user",
              is_active: true,
            },
          },
        });
      }

      const { error } = signUpResponse;
      if (error) {
        toast.error("Error submitting form", error.message);
        console.error("Signup error:", error);
        return;
      }

      toast.success("Account created successfully!");
      reset();
    } catch (err: any) {
      console.error("Unexpected signup error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center mt-6 min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">
          Create Your Account
        </h2>
        <p className="text-cgreen text-center mb-6">
          Join our platform and get started
        </p>

        <div className="space-y-6">
          <input
            {...register("full_name", { required: "Full name is required" })}
            type="text"
            placeholder="Full Name"
            className="w-full bg-sgreen text-black rounded-lg p-2 focus:outline-0"
          />
          <input
            {...register("contact_info", {
              required: "Email or phone is required",
            })}
            type="text"
            placeholder="Email or Phone"
            className="w-full bg-sgreen text-black rounded-lg p-2 focus:outline-0"
          />

          <input
            {...register("zone")}
            type="text"
            placeholder="Zone (optional)"
            className="w-full bg-sgreen text-black rounded-lg p-2 focus:outline-0"
          />

          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            placeholder="Password"
            className="w-full bg-sgreen text-black rounded-lg p-2 focus:outline-0"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer bg-cgreen text-cbg py-2 rounded-lg hover:bg-cgreen/90 transition-colors"
          >
            {isSubmitting ? "Creating..." : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
}
