"use client";
import { formatDistanceToNow } from "date-fns";

import { useState } from "react";
import { Phone, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetRequest } from "@/hook/request/useGetSingleRequest";

export function RequestDetail() {
  const [status, setStatus] = useState("responded");
  const [notes, setNotes] = useState("");
  const { locale, requestId } = useParams();
  const statuses = [
    { id: "responded", label: "Responded" },
    { id: "picked-up", label: "Picked Up" },
    { id: "en-route", label: "En Route" },
    { id: "delivered", label: "Delivered" },
  ];
  const {
    data: request,
    isLoading,
    error,
  } = useGetRequest(requestId as string);
  console.log(request);
  const updatedAt = request?.updated_at;
  return (
    <div className="max-w-5xl mx-auto p-6 bg-cbg">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link
            href={`/${locale}/request`}
            className="text-cgreen hover:underline"
          >
            Requests
          </Link>
          <span>/</span>
          <span>Request #12345</span>
        </div>
        <h1 className="text-3xl font-bold mb-1">{request?.request_number}</h1>
        <p className="text-sm text-cgreen">
          {updatedAt
            ? `Updated ${formatDistanceToNow(new Date(updatedAt), {
                addSuffix: true,
              })}`
            : "Just now"}
        </p>
      </div>
      <h2 className="text-lg font-semibold mb-4">Status</h2>
      <div className="space-y-3 mb-8">
        {statuses.map((s) => (
          <label
            key={s.id}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg shadow-sm border transition-all cursor-pointer  ${
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

      <h2 className="text-lg font-semibold mb-4">Recipient</h2>
      <div className="flex items-center justify-between my-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Sophia Clark</p>
            <p className="text-sm text-cgreen">123 Main Street, Anytown USA</p>
          </div>
        </div>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Phone className="w-5 h-5 text-cgreen" />
        </button>
      </div>
      {/* Admin Section */}
      <h2 className="text-lg font-semibold mb-2">Admin</h2>
      <div className="flex items-center justify-between my-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia" />
            <AvatarFallback>OB</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Olivia Bennett</p>
            <p className="text-sm text-muted-foreground">Admin</p>
          </div>
        </div>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Phone className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Delivery Confirmation Section */}
      <h2 className="text-lg font-semibold mb-2">Delivery Confirmation</h2>
      <div className="border-2 border-dashed border-cgreen rounded-lg p-8 text-center mb-6">
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="font-medium mb-1">Upload Photo</p>
        <p className="text-sm text-muted-foreground mb-4">
          Take a photo of the delivered items as proof of delivery
        </p>
        <Button variant="outline" size="sm">
          Take Photo
        </Button>
      </div>

      {/* Notes */}
      <div className="bg-cbg my-10">
        <label className="text-sm font-medium mb-2 block">Add Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes..."
          className="w-full bg-cbg min-h-24 px-3 py-2 border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cgreen"
        />
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <Button className="bg-cgreen hover:bg-cgreen/90 text-white">
          Update Status
        </Button>
      </div>
    </div>
  );
}
