"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useGetRequest } from "@/hook/request/useGetSingleRequest";
import { HeaderSection } from "../Single/HeaderSection";
import { StatusSection } from "../Single/StatusSection";
import { RecipientSection } from "../Single/RecipientSection";
import { UploadSection } from "../Single/UploadSection";
import { AdditionalInfoSection } from "../Single/Info";
import { NotesSection } from "../Single/NotesSection";
import { useUpdateRequest } from "@/hook/request/useUpdateRequest";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { uploadProofs } from "@/lib/supabaseClient";

export function RequestDetail() {
  const t = useTranslations("RequestDetail");
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { locale, requestId } = useParams();
  const { user } = useSelector((state: RootState) => state.user);
  const { data: request, isLoading, error } = useGetRequest(requestId as string);
  const updateRequest = useUpdateRequest();
  useEffect(() => {
    if (request?.status) setStatus(request.status);
    if (request?.notes) setNotes(request.notes);
  }, [request]);

  const hasUploaded = uploadedFiles.length > 0;
  const isTryingDelivered = status === "delivered";
  const isVolunteer = user?.role === "volunteer";


const handleUpdate = async () => {
  try {
    if (!request || !user) return;

    if (
      status === request.status &&
      notes === request.notes &&
      uploadedFiles.length === 0
    ) {
      toast.info(t("noChanges"));
      return;
    }

    if (isVolunteer && isTryingDelivered && !hasUploaded) {
      toast.error(t("uploadRequiredForDelivered"));
      return;
    }

    if (request.status === "delivered" && user.role !== "admin") {
      toast.error(t("adminOnlyAfterDelivered"));
      return;
    }

    let proofUrls: string[] = request.proof_urls || [];

    if (uploadedFiles.length > 0) {
      const newUrls = await uploadProofs({
        files: uploadedFiles,
        requestId: request.id,
      });
      proofUrls = [...proofUrls, ...newUrls];
    }

    updateRequest.mutate({
      requestId: request.id,
      status,
      notes,
      proofUrls,
    });

    setUploadedFiles([]);
  } catch (err: unknown) {
    if (err instanceof Error) {
      toast.error(err.message);
      console.error("Error updating request:", err.message);
    } else {
      toast.error("An unexpected error occurred.");
      console.error("Unknown error:", err);
    }
  }
};


  if (isLoading) return <div className="text-center py-10">{t("loading")}</div>;
  if (error) return <div className="text-center text-red-500">{t("error")}</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-cbg space-y-8">
      <HeaderSection request={request} locale={locale as string} />
      <StatusSection status={status} setStatus={setStatus} />
      <RecipientSection request={request} />

      <UploadSection
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
        hasUploaded={hasUploaded}
        isDeliveredAttempt={isVolunteer && isTryingDelivered}
      />

      <NotesSection notes={notes} setNotes={setNotes} />
      <AdditionalInfoSection request={request} />

      <div className="flex justify-end">
        <Button
          onClick={handleUpdate}
          disabled={updateRequest.isPending}
          className="bg-cgreen hover:bg-cgreen/90 text-white"
        >
          {updateRequest.isPending ? t("saving") : t("updateStatus")}
        </Button>
      </div>
    </div>
  );
}