"use client";

import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import Link from "next/link";
import { useTranslations } from "next-intl";

type FormData = {
  emailOrPhone: string;
  password: string;
};

export default function SignInForm() {
  const t = useTranslations("SignInForm");
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
      toast.error(t("errors.invalidInput"));
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

      const { data: authData, error } = response;

      if (error) {
        toast.error(error.message || t("errors.signInFailed"));
        return;
      }

      const { error: setSessionError } = await fetch("/api/auth/set-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
        }),
      }).then(res => res.json());

      if (setSessionError) {
        console.error("Failed to set session cookie:", setSessionError);
        toast.error(t("errors.sessionError"));
        return;
      }

      toast.success(t("success"));

      // Redirect to protected route
      window.location.href = "/en/request";
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error(t("errors.unexpectedError"));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl p-6 w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center mb-2">
          {t("title")}
        </h2>

        {/* Email or Phone */}
        <div>
          <input
            type="text"
            placeholder={t("emailOrPhonePlaceholder")}
            {...register("emailOrPhone", {
              required: t("errors.emailOrPhoneRequired"),
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
            placeholder={t("passwordPlaceholder")}
            {...register("password", {
              required: t("errors.passwordRequired"),
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
          className="w-full bg-cgreen text-white py-2 rounded-lg hover:bg-cgreen/80 cursor-pointer transition-colors"
        >
          {isSubmitting ? t("submittingButton") : t("submitButton")}
        </button>

       <p className="text-center">New to FMH? <Link href="/en/volunteer-signup" className="text-cgreen">Sign Up</Link></p>
      </form>
    </div>
  );
}

