"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSubmitRequest } from "@/hook/request/useSubmitRequest";
import { useTranslations } from "next-intl";
import { useCreateRequest } from "@/hook/request/useCreateRequest";
import { toast } from "sonner";

type FormValues = {
  name: string;
  contactInfo: string;
  zone: string; 
  source: string;
  typeOfNeed: string;
  otherNeed?: string;
  source_other?: string;
  notes: string;
};

export default function RequestForm() {
  const t = useTranslations("UserRequest");
  const [showOtherSources, setShowOtherSources] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showOtherNeed, setShowOtherNeed] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm<FormValues>();
  const submitRequest = useSubmitRequest();

  const selectedZone = watch("zone");
  const selectedNeed = watch("typeOfNeed");
  const selectedSource = watch("source");

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
  useEffect(() => {
    setShowOtherNeed(selectedNeed === "others");
  }, [selectedNeed]);
  useEffect(() => {
    setShowOtherSources(selectedSource === "other");
  }, [selectedSource]);
  const { mutateAsync } = useCreateRequest();
const onSubmit = async (data: FormValues) => {
  if (!isOnline) {
    alert(t("offlineAlert"));
    return;
  }

  const zone = data.zone?.trim();
  const need_type = showOtherNeed ? data.otherNeed?.trim() : data.typeOfNeed?.trim();
  const source = showOtherSources ? data.source_other?.trim() : data.source?.trim();

  // Ensure all required fields are filled
  if (!zone || !need_type || !source || !data.contactInfo?.trim()) {
    toast.error("Please fill in all required fields: Zone, Need Type, Source, and Contact Information.");
    return;
  }

  const requestData = {
    zone,
    need_type,
    source,
    contact_information: data.contactInfo.trim(),
    contact_name: data.name?.trim() || "",
    notes: data.notes?.trim() || "",
  };

  try {
    await mutateAsync(requestData); 
    toast.success("Request Submitted.");
    reset();
  } catch (error) {
    console.error("❌ Error creating request:", error);
    toast.error("Error submitting request. Make sure all fields are correct");
  }
};


  return (
    <div className="bg-cbg pt-14">
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-center text-3xl font-semibold text-black">
          {t("title")}
        </h2>

        {!isOnline && (
          <p className="text-center text-xs text-cgreen mt-1 mb-2">
            {t("offlineNotice")}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium">{t("nameLabel")}</label>
            <input
              {...register("name")}
              placeholder={t("namePlaceholder")}
              className="w-full bg-sgreen px-3 py-2 rounded-md outline-none"
            />
          </div>

          {/* Contact Information */}
          <div>
            <label className="text-sm font-medium">Contact Information</label>
            <input
              {...register("contactInfo")}
              placeholder="Contact information (email or phone)"
              className="w-full bg-sgreen px-3 py-2 rounded-md outline-none"
            />
          </div>

          {/* Zipcode (plain input) */}
          <div>
            <label className="text-sm font-medium">{t("zipcodeLabel") || "Zipcode"}</label>
            <input
              {...register("zone", { required: true })}
              placeholder={t("zipcodePlaceholder") || "Enter zipcode"}
              className="w-full bg-sgreen px-3 py-2 rounded-md outline-none"
            />
          </div>

          {/* Type of Need */}
          <div>
            <label className="text-sm font-medium">{t("needLabel")}</label>
            <select
              {...register("typeOfNeed", { required: true })}
              className="w-full bg-sgreen px-3 py-2 rounded-md outline-none"
            >
              <option value="">{t("selectNeed")}</option>
              <option value="food">{t("food")}</option>
              <option value="medical">{t("medical")}</option>
              <option value="education">{t("education")}</option>
              <option value="hygiene-kit">{t("hygiene-kit")}</option>
              <option value="others">Others</option>
            </select>

            {showOtherNeed && (
              <input
                {...register("otherNeed")}
                placeholder="Please specify (optional)"
                className="mt-2 w-full bg-sgreen px-3 py-2 rounded-md outline-none"
              />
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium">{t("notesLabel")}</label>
            <textarea
              {...register("notes")}
              placeholder={t("notesPlaceholder")}
              className="w-full bg-sgreen px-3 py-2 rounded-md outline-none h-24 resize-none"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="source"
              className="block text-sm font-medium text-gray-800"
            >
              Source <span className="text-red-500">*</span>
            </label>
            <select
              id="source"
              className="w-full bg-sgreen px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cgreen/70"
              {...register("source", { required: true })}
            >
              <option value="">Select</option>
              <option value="online">Online</option>
              <option value="manual">Manual</option>
              <option value="walk-in">Walk-in</option>
              <option value="referral">Referral</option>
              <option value="other">Other</option>
            </select>
            {showOtherSources && (
              <input
                type="text"
                placeholder="Please specify"
                className="w-full mt-2 bg-sgreen px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cgreen/70"
                {...register("source_other")}
              />
            )}
          </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={submitRequest.isPending || !isOnline}
            className={`w-full py-2 rounded-md text-white cursor-pointer transition ${
              isOnline ? "bg-cgreen hover:bg-cgreen/90" : "bg-gray-400"
            }`}
          >
            {submitRequest.isPending
              ? t("submitting")
              : isOnline
              ? t("submit")
              : t("offline")}
          </button>
        </form>
      </div>
    </div>
  );
}
