"use client";

import { useCreateRequest } from "@/hook/request/useCreateRequest";
import { RootState } from "@/store/store";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { capitalizeWords } from "@/lib/helper";

interface FormData {
  request_title: string;
  location: string;
  contact_description: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  priority: string;
  need_type: string;
  need_other?: string;
  zone: string;
  zone_other?: string;
  source: string;
  source_other?: string;
}

const RequestForm = () => {
  const t = useTranslations("RequestForm");
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>();
  const { user } = useSelector((state: RootState) => state.user);
  const { mutate } = useCreateRequest();

  const selectedZone = watch("zone");
  const selectedNeed = watch("need_type");
  const selectedSource = watch("source");

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (!data.contact_email && !data.contact_phone) {
      toast.error("Please enter a phone number or email.");
      return;
    }
    const contact_information = data.contact_email || data.contact_phone;

    const requestData = {
      request_title: data.request_title || "",
      contact_description: data.contact_description || "",
      contact_name: data.contact_name || "",
      contact_email: data.contact_email || "",
      contact_phone: data.contact_phone || "",
      contact_information,
      priority: data.priority,
      need_type:
        data.need_type === "other" && data.need_other
          ? data.need_other
          : data.need_type.toLowerCase(),
      zone:
        data.zone === "other" && data.zone_other
          ? data.zone_other
          : data.zone.toLowerCase(),
      source:
        data.source === "other" && data.source_other
          ? data.source_other
          : data.source.toLowerCase(),
      submitted_by: user?.id ?? null,
      contact_location: data.location,
    };

    mutate(requestData, {
      onSuccess: () => {
        toast.success(t("success"));
        reset();
      },
      onError: (err) => {
        console.error("❌ Error creating request:", err);
        toast.error(t("error"));
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-cbg p-8 rounded-xl">
      <h2 className="text-2xl font-semibold text-center text-black mb-6">
        {t("form-title")}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Request Title */}
        <div className="space-y-1">
          <label
            htmlFor="request_title"
            className="block text-sm font-medium text-gray-800"
          >
            {t("request-title")}
          </label>
          <input
            id="request_title"
            type="text"
            placeholder={t("request-title-placeholder")}
            className="w-full bg-sgreen px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cgreen/70"
            {...register("request_title")}
          />
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-800"
          >
            {t("location")}{" "}
            <span className="text-sm text-gray-500">(Optional)</span>
          </label>
          <input
            id="location"
            type="text"
            className="w-full bg-sgreen px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cgreen/70"
            {...register("location")}
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label
            htmlFor="contact_description"
            className="block text-sm font-medium text-gray-800"
          >
            {t("description")}
          </label>
          <textarea
            id="contact_description"
            placeholder={t("description-placeholder")}
            className="w-full bg-sgreen px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cgreen/70 h-24 resize-none"
            {...register("contact_description", { required: true })}
          />
        </div>

        {/* Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label
              htmlFor="contact_name"
              className="block text-sm font-medium text-gray-800"
            >
              {t("contact-name")}{" "}
              <span className="text-red-500 text-sm">(Optional)</span>
            </label>
            <input
              id="contact_name"
              type="text"
              placeholder={t("contact-name-placeholder")}
              className="w-full bg-sgreen px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cgreen/70"
              {...register("contact_name")}
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="contact_phone"
              className="block text-sm font-medium text-gray-800"
            >
              {t("contact-phone")}{" "}
              <span className="text-red-500 text-sm">
                * Either phone or email
              </span>
            </label>
            <input
              id="contact_phone"
              type="tel"
              placeholder={t("contact-phone-placeholder")}
              className="w-full bg-sgreen px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cgreen/70"
              {...register("contact_phone")}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="contact_email"
            className="block text-sm font-medium text-gray-800"
          >
            {t("contact-email")}{" "}
            <span className="text-red-500 text-sm">
              * Either phone or email
            </span>
          </label>
          <input
            id="contact_email"
            type="email"
            placeholder={t("contact-email-placeholder")}
            className="w-full bg-sgreen px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cgreen/70"
            {...register("contact_email")}
          />
        </div>
        {/* Priority */}
        <div className="space-y-1">
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-800"
          >
            {t("priority")}
          </label>
          <select
            id="priority"
            className="w-full bg-sgreen px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cgreen/70"
            {...register("priority")}
          >
            <option value="">{t("select")}</option>
            <option value="low">{t("low")}</option>
            <option value="medium">{t("medium")}</option>
            <option value="high">{t("high")}</option>
          </select>
        </div>

        {/* Need Type */}
        <div className="space-y-1">
          <label
            htmlFor="need_type"
            className="block text-sm font-medium text-gray-800"
          >
            {t("need-type")} <span className="text-red-500">*</span>
          </label>
          <select
            id="need_type"
            className="w-full bg-sgreen px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cgreen/70"
            {...register("need_type", { required: true })}
          >
            <option value="">{t("select")}</option>
            <option value="medical">{t("medical")}</option>
            <option value="food">{t("food")}</option>
            <option value="shelter">{t("shelter")}</option>
            <option value="clothing">{t("clothing")}</option>
            <option value="transportation">{t("transportation")}</option>
            <option value="other">Other</option>
          </select>
          {selectedNeed === "other" && (
            <input
              type="text"
              placeholder="Please specify"
              className="w-full mt-2 bg-sgreen px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cgreen/70"
              {...register("need_other")}
            />
          )}
        </div>

        {/* Zone */}
        <div className="space-y-1">
          <label
            htmlFor="zone"
            className="block text-sm font-medium text-gray-800"
          >
            {t("zone")} <span className="text-red-500">*</span>
          </label>
          <select
            id="zone"
            className="w-full bg-sgreen px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cgreen/70"
            {...register("zone", { required: true })}
          >
            <option value="">{t("select")}</option>
            <option value="north">{t("north")}</option>
            <option value="south">{t("south")}</option>
            <option value="other">Other</option>
          </select>
          {selectedZone === "other" && (
            <input
              type="text"
              placeholder="Please specify"
              className="w-full mt-2 bg-sgreen px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cgreen/70"
              {...register("zone_other")}
            />
          )}
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
            <option value="">{t("select")}</option>
            <option value="online">Online</option>
            <option value="manual">Manual</option>
            <option value="walk-in">Walk-in</option>
            <option value="referral">Referral</option>
            <option value="other">Other</option>
          </select>
          {selectedSource === "other" && (
            <input
              type="text"
              placeholder="Please specify"
              className="w-full mt-2 bg-sgreen px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cgreen/70"
              {...register("source_other")}
            />
          )}
        </div>

        {(selectedZone || selectedNeed || selectedSource) && (
          <div className="flex flex-wrap gap-2 justify-center mt-4 text-sm text-cgreen">
            {selectedZone && <span className="bg-sgreen p-1 rounded-full">Zone: {capitalizeWords(selectedZone)}</span>}
            {selectedNeed && <span className="bg-sgreen p-1 rounded-full">Need: {capitalizeWords(selectedNeed)}</span>}
            {selectedSource && (
              <span className="bg-sgreen p-1 rounded-full">Source: {capitalizeWords(selectedSource)}</span>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          } w-full py-3 text-white bg-cgreen rounded-md font-medium hover:bg-cgreen/90 transition-all`}
        >
          {isSubmitting ? t("Submitting..") : t("submit")}
        </button>
      </form>
    </div>
  );
};

export default RequestForm;
