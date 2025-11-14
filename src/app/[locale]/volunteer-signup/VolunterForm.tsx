"use client";

import { useForm } from "react-hook-form";
import { useVolunteerSubmit } from "@/hook/useVolunteerSubmit";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

type VolunteerFormData = {
  full_name: string;
  contact_info: string;
  password?: string;
  skills?: string;
  availability?: string;
};

export default function VolunteerForm() {
  const t = useTranslations("VolunteerForm");
  const { register, handleSubmit, reset } = useForm<VolunteerFormData>();
  const submitVolunteer = useVolunteerSubmit();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    updateStatus();
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

const onSubmit = async (data: VolunteerFormData) => {
  const isEmail = data.contact_info.includes("@");
  let signUpResponse;

  if (isEmail) {

    signUpResponse = await supabase.auth.signUp({
      email: data.contact_info,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          phone: "", 
          role: "volunteer",
          skills: data.skills || "",
          availability: data.availability || "",
          is_active: true,
        },
      },
    });
  } else {
    signUpResponse = await supabase.auth.signUp({
      phone: data.contact_info,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          email: "", 
          role: "volunteer",
          skills: data.skills || "",
          availability: data.availability || "",
          is_active: true,
        },
      },
    });
  }

  const { error } = signUpResponse;

  if (error) {
    toast.error(error.message || "Signup failed");
    console.error("Signup error:", error);
    return;
  }

  toast.success("Thank you for requesting to help FMH strengthen and connect communities! We’ll be contacting you soon");
  reset();
};

  return (
    <div className="max-w-md mx-auto p-6 md:p-8 mt-8 mb-6">
      <h1 className="text-center text-xl md:text-2xl font-semibold text-black mb-2">
        {t("title")}
      </h1>

      {!isOnline && (
        <p className="text-center text-sm text-cgreen mb-3">
          {t("offlineNotice")}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("fullNameLabel")}
          </label>
          <input
            type="text"
            placeholder={t("fullNamePlaceholder")}
            {...register("full_name", { required: true })}
            className="mt-1 w-full px-3 py-2 bg-sgreen rounded-md outline-none focus:ring-2 focus:ring-cgreen"
          />
        </div>

        {/* Contact Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("contactLabel")}
          </label>
          <input
            type="text"
            placeholder={t("contactPlaceholder")}
            {...register("contact_info", { required: true })}
            className="mt-1 w-full px-3 py-2 bg-sgreen rounded-md outline-none focus:ring-2 focus:ring-cgreen"
          />
        </div>
        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("passwordLabel")}
          </label>
          <input
            type="password"
            placeholder={t("passwordPlaceholder")}
            {...register("password")}
            className="mt-1 w-full px-3 py-2 bg-sgreen rounded-md outline-none focus:ring-2 focus:ring-cgreen"
          />
        </div>
        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("skillsLabel")}
          </label>
          <textarea
            placeholder={t("skillsPlaceholder")}
            {...register("skills")}
            className="mt-1 w-full px-3 py-2 bg-sgreen rounded-md outline-none h-24 resize-none focus:ring-2 focus:ring-cgreen"
          />
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("availabilityLabel")}
          </label>
          <textarea
            placeholder={t("availabilityPlaceholder")}
            {...register("availability")}
            className="mt-1 w-full px-3 py-2 bg-sgreen rounded-md outline-none h-24 resize-none focus:ring-2 focus:ring-cgreen"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitVolunteer.isPending || !isOnline}
          className={`w-full py-2 rounded-md text-white font-medium transition ${
            isOnline ? "bg-cgreen hover:bg-cgreen/90" : "bg-gray-400"
          }`}
        >
          {submitVolunteer.isPending
            ? t("submitting")
            : isOnline
            ? t("submit")
            : t("offline")}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-6">
        © 2024 Community Connect. {t("rightsReserved")}
      </p>
    </div>
  );
}
