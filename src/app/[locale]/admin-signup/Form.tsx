"use client";

import { SignUpData } from "@/types/types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

interface SignUpExtendedData extends SignUpData {
  avatar: FileList;
  secretKey?: string;
}

const ADMIN_SECRET_KEY = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY;

export default function SignUpForm() {
  const t = useTranslations("SignUp");
  const [showSecretKey, setShowSecretKey] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpExtendedData>();

  const secretKeyValue = watch("secretKey");

  const onSubmit = async (data: SignUpExtendedData) => {
    // Validate secret key if provided
    const hasValidSecretKey = data.secretKey && data.secretKey === ADMIN_SECRET_KEY;

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
          // Instant activation if valid secret key, otherwise pending approval
          is_active: hasValidSecretKey,
          profile_picture: avatarUrl,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      console.error("Signup error:", error);
      return;
    }

    if (hasValidSecretKey) {
      toast.success(t("successInstant") || "Account created! You can now sign in.");
    } else {
      toast.success(t("successPending") || "Account created! Waiting for admin approval.");
    }
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

          {/* Secret Key Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hasSecretKey"
              checked={showSecretKey}
              onChange={(e) => setShowSecretKey(e.target.checked)}
              className="w-4 h-4 accent-cgreen"
            />
            <label htmlFor="hasSecretKey" className="text-sm text-gray-600 cursor-pointer">
              {t("hasSecretKey") || "I have an admin secret key"}
            </label>
          </div>

          {/* Conditional Secret Key Input */}
          {showSecretKey && (
            <input
              {...register("secretKey")}
              type="password"
              placeholder={t("secretKeyPlaceholder") || "Enter admin secret key"}
              className="w-full focus:border-0 focus:outline-0 bg-sgreen text-black rounded-lg p-2"
            />
          )}

          {/* Info message */}
          <p className="text-xs text-gray-500">
            {showSecretKey && secretKeyValue
              ? (t("instantAccessInfo") || "With valid key, you'll get instant access.")
              : (t("pendingApprovalInfo") || "Without key, your account will need admin approval.")}
          </p>

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
