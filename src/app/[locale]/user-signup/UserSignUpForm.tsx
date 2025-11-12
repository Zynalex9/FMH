"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useTranslations } from "next-intl";

type SignUpData = {
  full_name: string;
  contact_info: string;
  zone?: string;
  password: string;
};

export default function UserSignUpForm() {
  const t = useTranslations("UserSignUpForm");
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
        toast.error(t("errors.submitError"), error.message);
        console.error("Signup error:", error);
        return;
      }

      toast.success(t("success"));
      reset();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Unexpected signup error:", err);
        toast.error(t("errors.unexpectedError"));
      } else {
        toast.error(t("errors.unexpectedError"));
        console.error("Unknown error:", err);
      }
    }
  };

  return (
    <div className="flex justify-center items-center mt-6 min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">{t("title")}</h2>
        <p className="text-cgreen text-center mb-6">{t("subtitle")}</p>

        <div className="space-y-6">
          <input
            {...register("full_name", {
              required: t("errors.fullNameRequired"),
            })}
            type="text"
            placeholder={t("fullName")}
            className="w-full bg-sgreen text-black rounded-lg p-2 focus:outline-0"
          />
          {errors.full_name && (
            <p className="text-red-500 text-sm -mt-4">
              {errors.full_name.message}
            </p>
          )}

          <input
            {...register("contact_info", {
              required: t("errors.contactRequired"),
            })}
            type="text"
            placeholder={t("contactInfo")}
            className="w-full bg-sgreen text-black rounded-lg p-2 focus:outline-0"
          />
          {errors.contact_info && (
            <p className="text-red-500 text-sm -mt-4">
              {errors.contact_info.message}
            </p>
          )}

          <input
            {...register("zone")}
            type="text"
            placeholder={t("zone")}
            className="w-full bg-sgreen text-black rounded-lg p-2 focus:outline-0"
          />

          <input
            {...register("password", {
              required: t("errors.passwordRequired"),
            })}
            type="password"
            placeholder={t("password")}
            className="w-full bg-sgreen text-black rounded-lg p-2 focus:outline-0"
          />
          {errors.password && (
            <p className="text-red-500 text-sm -mt-4">
              {errors.password.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer bg-cgreen text-cbg py-2 rounded-lg hover:bg-cgreen/90 transition-colors"
          >
            {isSubmitting ? t("submittingButton") : t("submitButton")}
          </button>
        </div>
      </form>
    </div>
  );
}
