import { Upload } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";

interface Props {
  uploadedFiles: File[];
  setUploadedFiles: Dispatch<SetStateAction<File[]>>;
  hasUploaded: boolean;
  isDeliveredAttempt: boolean; // NEW
}

export function UploadSection({
  uploadedFiles,
  setUploadedFiles,
  hasUploaded,
  isDeliveredAttempt,
}: Props) {
  const t = useTranslations("RequestDetail.UploadSection");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  return (
    <div className="border border-border rounded-lg p-4 mb-8 space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium cursor-pointer text-cgreen    hover:underline">
        <Upload className="w-4 h-4" />
        {t("uploadPhoto")}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      {/* List uploaded files */}
      {uploadedFiles.length > 0 && (
        <ul className="mt-2 text-sm space-y-1">
          {uploadedFiles.map((file, idx) => (
            <li key={idx} className="text-cgreen">
              {file.name}
            </li>
          ))}
        </ul>
      )}

      {/* Warning: required for delivered */}
      {isDeliveredAttempt && !hasUploaded && (
        <p className="text-xs text-red-600 mt-1">{t("requiredForDelivered")}</p>
      )}
    </div>
  );
}
