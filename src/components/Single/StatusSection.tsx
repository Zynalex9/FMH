import { Dispatch, SetStateAction } from "react";

export function StatusSection({
  status,
  setStatus,
}: {
  status: string;
  setStatus: Dispatch<SetStateAction<string>>;
}) {
  const statuses = [
    { id: "requested", label: "Requested" },
    { id: "picked_up", label: "Picked Up" },
    { id: "en_route", label: "En Route" },
    { id: "delivered", label: "Delivered" },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Status</h2>
      <div className="space-y-3 mb-8">
        {statuses.map((s) => (
          <label
            key={s.id}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg shadow-sm border transition-all cursor-pointer ${
              status === s.id
                ? "border-cgreen bg-cbg"
                : "border-border bg-cbg hover:shadow-md"
            }`}
          >
            <span className="text-sm font-medium">{s.label}</span>
            <span
              className={`w-5 h-5 flex items-center justify-center rounded-full border transition-all ${
                status === s.id
                  ? "bg-cgreen border-cgreen"
                  : "border-gray-300 bg-white"
              }`}
            >
              {status === s.id && (
                <span className="w-2 h-2 bg-white rounded-full" />
              )}
            </span>
            <input
              type="radio"
              name="status"
              value={s.id}
              checked={status === s.id}
              onChange={(e) => setStatus(e.target.value)}
              className="hidden"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
