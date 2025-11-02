import { Upload } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export function UploadSection({ uploadedFiles, setUploadedFiles }: { uploadedFiles: File[]; setUploadedFiles: Dispatch<SetStateAction<File[]>>}) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
  };

  return (
    <div className="border border-border rounded-lg p-4 mb-8 space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium cursor-pointer text-cgreen hover:underline">
        <Upload className="w-4 h-4" />
        Upload Photo
        <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
      </label>
      {uploadedFiles.length > 0 && (
        <ul className="mt-2 text-sm">
          {uploadedFiles.map((file: File, idx: number) => (
            <li key={idx}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
