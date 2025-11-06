"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useCreateSupportOffer } from "@/hook/useCreateSupportOffer";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type SupportOfferForm = {
  full_name: string;
  contact_information: string;
  donation_type: string;
  donationTypeOther?: string;
  for_events: boolean;
  for_outreachs: boolean;
  availability: string;
};

export default function SupportOfferPage() {
  const t = useTranslations("SupportOffer");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<SupportOfferForm>();

  const [isOnline, setIsOnline] = useState(true);
  const { mutateAsync } = useCreateSupportOffer();
  const selectedDonationType = watch("donation_type");
  const donationTypeOther = watch("donationTypeOther");
  const { user } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const onSubmit = async (
    data: SupportOfferForm & { donationTypeOther?: string }
  ) => {
    const { donationTypeOther, ...rest } = data;
    const requestData = {
      ...rest,
      created_by: user?.id || null,
      donation_type:
        data.donation_type === "other" && donationTypeOther
          ? donationTypeOther
          : data.donation_type,
    };

    try {
      await mutateAsync(requestData);
      reset();
    } catch (error) {
      console.error("Error submitting:", error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-cbg pt-16 p-4">
      <div className="w-full max-w-md bg-cbg p-6 rounded-md">
        <h1 className="text-4xl font-semibold text-center mb-6">
          {t("title")}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block mb-1">{t("full-name")}</label>
            <input
              {...register("full_name", { required: true })}
              placeholder={t("full-name-placeholder")}
              className="w-full p-2 rounded-md bg-sgreen text-cgreen placeholder:text-cgreen focus:outline-none focus:ring-2 focus:ring-cgreen"
            />
          </div>

          <div>
            <label className="block mb-1">{t("contact-info")}</label>
            <input
              {...register("contact_information", { required: true })}
              placeholder={t("contact-info-placeholder")}
              className="w-full p-2 rounded-md bg-sgreen text-cgreen placeholder:text-cgreen focus:outline-none focus:ring-2 focus:ring-cgreen"
            />
          </div>

          <div>
            <label className="block mb-1">{t("donation-type")}</label>
            <select
              {...register("donation_type", { required: true })}
              className="w-full p-2 rounded-md bg-sgreen text-black focus:outline-none focus:ring-2 focus:ring-cgreen"
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

          {/* Optional Specify Field if Other is selected */}
          {selectedDonationType === "other" && (
            <div>
              <label className="block mb-1">
                {`Please Specify`}{" "}
                <span className="text-sm text-gray-500">(optional)</span>
              </label>
              <input
                {...register("donationTypeOther")}
                autoFocus
                className="w-full p-2 rounded-md bg-sgreen text-cgreen placeholder:text-cgreen focus:outline-none focus:ring-2 focus:ring-cgreen"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label>{t("volunteer-options")}</label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 accent-cgreen border-2 border-cgreen rounded-md focus:ring-2 focus:ring-cgreen"
                {...register("for_events")}
              />
              {t("volunteer-events")}
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 accent-cgreen border-2 border-cgreen rounded-md focus:ring-2 focus:ring-cgreen"
                {...register("for_outreachs")}
              />
              {t("volunteer-outreach")}
            </label>
          </div>

          <div>
            <label className="block mb-1">{t("availability")}</label>
            <textarea
              {...register("availability")}
              placeholder={t("availability-placeholder")}
              rows={5}
              className="w-full p-2 rounded-md bg-sgreen text-cgreen placeholder:text-cgreen focus:outline-none focus:ring-2 focus:ring-cgreen"
            />
          </div>

          {/* Selected Donation Type Display with Fade-in */}
          {(selectedDonationType || donationTypeOther) && (
            <p className="text-center text-cgreen font-medium transition-all duration-300">
              Donation:{" "}
              {selectedDonationType === "other"
                ? donationTypeOther || "Other"
                : t(selectedDonationType)}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cgreen text-white py-2 rounded-md hover:bg-cgreen/90 cursor-pointer transition"
          >
            {isSubmitting ? t("submitting") : t("submit")}
          </button>
        </form>

        <p
          className={`mt-4 text-center text-sm ${
            isOnline ? "text-cgreen" : "text-red-500"
          }`}
        >
          {isOnline ? t("online-msg") : t("offline-msg")}
        </p>
      </div>
    </main>
  );
}
