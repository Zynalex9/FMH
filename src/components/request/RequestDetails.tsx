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

interface RequestDetailProps {}

export function RequestDetail({}: RequestDetailProps) {
  const t = useTranslations("RequestDetail");
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { locale, requestId } = useParams();

  const {
    data: request,
    isLoading,
    error,
  } = useGetRequest(requestId as string);

  useEffect(() => {
    if (request?.status) setStatus(request.status);
    if (request?.notes) setNotes(request.notes);
  }, [request]);

  const updateRequest = useUpdateRequest(status, notes, requestId as string);

  if (isLoading) return <div className="text-center py-10">{t("loading")}</div>;
  if (error)
    return (
      <div className="text-center text-red-500">{t("error")}</div>
    );

  const handleUpdate = async () => {
    if(!request) return;
    if(status === request.status && notes === request.notes) {
      toast.info(t("noChanges"));
      return;
    }
    updateRequest.mutate(); 
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-cbg space-y-8">
      <HeaderSection request={request} locale={locale as string} />
      <StatusSection status={status} setStatus={setStatus} />
      <RecipientSection request={request} />
      <UploadSection
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
      />
      <NotesSection notes={notes} setNotes={setNotes} />
      <AdditionalInfoSection request={request} />
      <div className="flex justify-end">
        <Button onClick={handleUpdate} className="bg-cgreen hover:bg-cgreen/90 text-white">
          {t("updateStatus")}
        </Button>
      </div>
    </div>
  );
}