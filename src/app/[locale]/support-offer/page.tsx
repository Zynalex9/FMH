"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useCreateSupportOffer } from "@/hook/useCreateSupportOffer";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { toast } from "sonner";
import { useParams } from "next/navigation";

type SupportOfferForm = {
  full_name: string;
  contact_information: string;
  password?: string;
  donation_type: string;
  donationTypeOther?: string;
  availability: string;
  for_events?: boolean;
  for_outreachs?: boolean;
  for_both?: boolean;
};

export default function SupportOfferPage() {
  const t = useTranslations("SupportOffer");
  const { locale } = useParams();

  const { user } = useSelector((state: RootState) => state.user);
  const { mutateAsync } = useCreateSupportOffer();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<SupportOfferForm>();

  const selectedDonationType = watch("donation_type");
  const forBoth = watch("for_both");

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (user) {
      setValue("full_name", user.full_name || "");
      setValue("contact_information", user.email || user.phone || "");
    }
  }, [user, setValue]);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    handleStatus();
    window.addEventListener("online", handleStatus);
    window.addEventListener("offline", handleStatus);
    return () => {
      window.removeEventListener("online", handleStatus);
      window.removeEventListener("offline", handleStatus);
    };
  }, []);
  console.log(user)
  const signUpIfNeeded = async (data: SupportOfferForm) => {
    if (user) return user;

    if (!data.password) {
      toast.error("Please set a password to create your donor account.");
      throw new Error("Password required");
    }

    const isEmail = data.contact_information.includes("@");

    const for_events = data.for_both ? true : data.for_events || false;
    const for_outreachs = data.for_both ? true : data.for_outreachs || false;

    const signUpPayload = isEmail
      ? {
        email: data.contact_information,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            role: "donor",
            is_active: true,
            for_events,
            for_outreachs,
          },
        },
      }
      : {
        phone: data.contact_information,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            role: "donor",
            is_active: true,
            for_events,
            for_outreachs,
          },
        },
      };

    const response = await supabase.auth.signUp(signUpPayload);

    if (response.error) {
      console.error("Signup error:", response.error);
      toast.error(response.error.message);
      throw response.error;
    }

    return response.data.user;
  };

 const onSubmit = async (data: SupportOfferForm) => {
  try {
    const createdUser = await signUpIfNeeded(data);

    const { password, donationTypeOther, for_events, for_outreachs, for_both, ...rest } = data;

    const requestData = {
      ...rest,
      created_by: createdUser?.id || user?.id || null,
      donation_type:
        data.donation_type === "other" && donationTypeOther
          ? donationTypeOther
          : data.donation_type,
      for_events:
        user?.role === "donor"
          ? user.metadata?.for_events ?? user.for_events ?? false
          : for_both
          ? true
          : for_events ?? false,
      for_outreachs:
        user?.role === "donor"
          ? user.metadata?.for_outreachs ?? user.for_outreachs ?? false
          : for_both
          ? true
          : for_outreachs ?? false,
    };

    await mutateAsync(requestData);
    reset();
  } catch (err) {
    console.error(err);
  }
};


  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-cbg pt-16 p-4">
      <div className="w-full max-w-md bg-cbg p-6 rounded-md">
        <h1 className="text-4xl font-semibold text-center mb-6">{t("title")}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block mb-1">{t("full-name")}</label>
            <input
              {...register("full_name", { required: true })}
              placeholder={t("full-name-placeholder")}
              className="w-full p-2 rounded-md bg-sgreen text-cgreen placeholder:text-cgreen"
            />
          </div>

          <div>
            <label className="block mb-1">{t("contact-info")}</label>
            <input
              {...register("contact_information", { required: true })}
              disabled={!!user}
              placeholder={t("contact-info-placeholder")}
              className={`w-full p-2 rounded-md bg-sgreen text-cgreen placeholder:text-cgreen ${user ? "opacity-60 cursor-not-allowed" : ""
                }`}
            />
          </div>

          {!user && (
            <div>
              <label className="block mb-1">{t("passwordLabel")}</label>
              <input
                type="password"
                {...register("password", { required: true })}
                className="w-full p-2 rounded-md bg-sgreen text-cgreen focus:outline-none"
                placeholder="Create a password"
              />
            </div>
          )}

          <div>
            <label className="block mb-1">{t("donation-type")}</label>
            <select
              {...register("donation_type", { required: true })}
              className="w-full p-2 rounded-md bg-sgreen text-black"
            >
              <option value="">{t("select")}</option>
              <option value="money">{t("money")}</option>
              <option value="food">{t("food")}</option>
              <option value="clothes">{t("clothes")}</option>
              <option value="medicine">{t("medicine")}</option>
              <option value="hygiene-kit">{t("hygiene-kit")}</option>
              <option value="other">Other</option>
            </select>
          </div>

          {selectedDonationType === "other" && (
            <div>
              <label className="block mb-1">Please Specify</label>
              <input
                {...register("donationTypeOther")}
                className="w-full p-2 rounded-md bg-sgreen text-cgreen"
              />
            </div>
          )}

          {!user && (
            <div className="flex flex-col gap-2">
              <label>{t("volunteer-options")}</label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("for_events")}
                  disabled={forBoth}
                  className="h-4 w-4 accent-cgreen"
                />
                {t("volunteer-events")}
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("for_outreachs")}
                  disabled={forBoth}
                  className="h-4 w-4 accent-cgreen"
                />
                {t("volunteer-outreach")}
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("for_both")}
                  className="h-4 w-4 accent-cgreen"
                />
                {t("volunteer-both")}
              </label>
            </div>
          )}

          <div>
            <label className="block mb-1">{t("availability")}</label>
            <textarea
              {...register("availability")}
              placeholder={t("availability-placeholder")}
              rows={5}
              className="w-full p-2 rounded-md bg-sgreen text-cgreen"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cgreen text-white py-2 rounded-md hover:bg-cgreen/90"
          >
            {isSubmitting ? t("submitting") : t("submit")}
          </button>
        </form>

        <p
          className={`mt-4 text-center text-sm ${isOnline ? "text-cgreen" : "text-red-500"
            }`}
        >
          {isOnline ? t("online-msg") : t("offline-msg")}
        </p>

        {!user && (
          <p className="text-center mt-4">
            <Link href={`/${locale}/signin`} className="text-cgreen underline text-sm">
              Already a donor? Sign in
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
