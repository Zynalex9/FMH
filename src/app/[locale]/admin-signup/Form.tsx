"use client";

import { SignUpData, Role } from "@/types/types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabaseClient";
interface SignUpExtendedData extends SignUpData {
  avatar: FileList;
}
export default function SignUpForm() {
  const t = useTranslations("SignUp");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpExtendedData>();

  const onSubmit = async (data: SignUpExtendedData) => {
    let avatarUrl = null;
    if (data.avatar && data.avatar.length > 0) {
      const file = data.avatar[0];
      const fileExtension = file.name.split(".").pop();
      const fileName = `${
        data.full_name ? data.full_name : "user"
      }_${Date.now()}.${fileExtension}`;
      const filePath = `profile_pictures/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("FMH")
        .upload(filePath, file);
      if (uploadError) {
        console.error("Error uploading avatar:", uploadError.message);
      } else {
        const {
          data: { publicUrl },
        } = supabase.storage.from("boardio").getPublicUrl(filePath);
        avatarUrl = publicUrl;
      }
    }
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name?.trim() || null,
          phone: data.phone?.trim() || null,
          role: "admin",
          is_active: false,
          profile_picture: avatarUrl,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      console.error("Signup error:", error);
      return;
    }

    toast.success(t("success"));
    reset();
  };
  return (
    <div className="flex justify-center items-center mt-6 min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">{t("title")}</h2>
        <p className="text-cgreen text-center mb-6">{t("sub-title")}</p>

        <div className="space-y-6">
          <input
            {...register("full_name", { required: t("name") })}
            type="text"
            placeholder={t("name")}
            className="w-full focus:border-0 focus:outline-0 bg-sgreen text-black rounded-lg p-2"
          />

          <input
            {...register("email", { required: t("email") })}
            type="email"
            placeholder={t("email")}
            className="w-full focus:border-0 focus:outline-0 bg-sgreen text-black rounded-lg p-2"
          />

          <input
            {...register("phone")}
            type="tel"
            placeholder={t("phone")}
            className="w-full focus:border-0 focus:outline-0 bg-sgreen text-black rounded-lg p-2"
          />

          <input
            {...register("password", { required: t("password") })}
            type="password"
            placeholder={t("password")}
            className="w-full focus:border-0 focus:outline-0 bg-sgreen text-black rounded-lg p-2"
          />
          <input
            id="avatar"
            type="file"
            accept="image/*"
            className="w-full focus:border-0 cursor-pointer focus:outline-0 bg-sgreen text-black rounded-lg p-2"
            {...register("avatar")}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer bg-cgreen text-cbg py-2 rounded-lg hover:bg-cgreen/90 transition-colors"
          >
            {isSubmitting ? "..." : t("submit")}
          </button>
        </div>
      </form>
    </div>
  );
}
