import { Dispatch, SetStateAction } from "react";

export function NotesSection({
  notes,
  setNotes,
}: {
  notes: string;
  setNotes: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="border-dashed border-2 border-cgreen rounded-lg p-4 mb-8">
      <label className="text-sm font-medium mb-2 block">Add Notes</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add any additional notes..."
        className="w-full bg-cbg min-h-24 px-3 py-2 border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cgreen"
      />
    </div>
  );
}
