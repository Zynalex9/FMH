"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import Link from "next/link";
import { useParams } from "next/navigation";

type VolunteerFormData = {
  full_name: string;
  contact_info: string;
  password?: string;
  availability?: string;
  volunteer_options?: string[];
};

export default function VolunteerForm() {
  const t = useTranslations("VolunteerForm");
  const { register, handleSubmit, reset } = useForm<VolunteerFormData>();
  const [loading, setLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(true);
  const { locale } = useParams();

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
    setLoading(true)
    const isEmail = data.contact_info.includes("@");
    const volunteerOptions = data.volunteer_options || [];
    let signUpResponse;
    if (isEmail) {
      const signUpData = {
        email: data.contact_info,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            phone: "",
            role: "volunteer",
            availability: data.availability || "",
            volunteer_options: volunteerOptions,
            is_active: true,
          },
        },
      }
      console.log(signUpData)
      signUpResponse = await supabase.auth.signUp(signUpData);
    } else {
      const signUpData = {
        phone: data.contact_info,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            email: "",
            role: "volunteer",
            availability: data.availability || "",
            volunteer_options: volunteerOptions,
            is_active: true,
          },
        },
      }
      console.log(signUpData)
      signUpResponse = await supabase.auth.signUp(signUpData);
    }

    const { error } = signUpResponse;
    if (error) {
      toast.error(error.message || "Signup failed");
      console.error("Signup error:", error);
      setLoading(false)

      return;
    }

    toast.success(
      "Thank you for requesting to help FMH strengthen and connect communities! We’ll be contacting you soon"
    );
    setLoading(false)
    reset();
  };

  return (
    <div className="max-w-md mx-auto p-6 md:p-8 mt-8 mb-6">
      <h1 className="text-center text-xl md:text-2xl font-semibold text-black mb-2">
        {t("title")}
      </h1>

      {!isOnline && (
        <p className="text-center text-sm text-cgreen mb-3">{t("offlineNotice")}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("fullNameLabel")}</label>
          <input
            type="text"
            placeholder={t("fullNamePlaceholder")}
            {...register("full_name", { required: true })}
            className="mt-1 w-full px-3 py-2 bg-sgreen rounded-md outline-none focus:ring-2 focus:ring-cgreen"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("contactLabel")}</label>
          <input
            type="text"
            placeholder={t("contactPlaceholder")}
            {...register("contact_info", { required: true })}
            className="mt-1 w-full px-3 py-2 bg-sgreen rounded-md outline-none focus:ring-2 focus:ring-cgreen"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t("passwordLabel")}</label>
          <input
            type="password"
            placeholder={t("passwordPlaceholder")}
            {...register("password")}
            className="mt-1 w-full px-3 py-2 bg-sgreen rounded-md outline-none focus:ring-2 focus:ring-cgreen"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t("skillsLabel")}</label>
          <div className="mt-2 flex flex-col space-y-2">
            {["At events", "During outreach", "Deliveries", "All"].map((option) => (
              <label key={option} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option}
                  {...register("volunteer_options")}
                  className="w-4 h-4 text-cgreen border-gray-300 rounded focus:ring-cgreen"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t("availabilityLabel")}</label>
          <textarea
            placeholder={t("availabilityPlaceholder")}
            {...register("availability")}
            className="mt-1 w-full px-3 py-2 bg-sgreen rounded-md outline-none h-24 resize-none focus:ring-2 focus:ring-cgreen"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !isOnline}
          className={`w-full py-2 rounded-md text-white font-medium transition ${isOnline ? "bg-cgreen hover:bg-cgreen/90" : "bg-gray-400"
            }`}
        >
          {loading ? t("submitting") : isOnline ? t("submit") : t("offline")}
        </button>
      </form>

      <p className="text-center mt-4">
        <Link href={`/${locale}/signin`} className="text-cgreen underline text-sm">
          Already a volunteer? Login
        </Link>
      </p>

      <p className="text-center text-xs text-gray-500 mt-6">
        © 2024 Community Connect. {t("rightsReserved")}
      </p>
    </div>
  );
}
