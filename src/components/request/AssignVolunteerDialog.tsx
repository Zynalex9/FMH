"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { debounce } from "lodash";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Volunteer {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
}

export default function AssignVolunteerDialog({
  requestId,
}: {
  requestId: string;
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(false);

  // --- Fetch volunteers with debounce ---
  const fetchVolunteers = useCallback(
    debounce(async (term: string) => {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name, email, phone")
        .or(
          `full_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`
        )
        .eq("role", "volunteer");

      if (!error) setVolunteers(data || []);
      setLoading(false);
    }, 500),
    []
  );

  useEffect(() => {
    fetchVolunteers(searchTerm);
  }, [searchTerm, fetchVolunteers]);

  // --- Handle assigning ---
  const handleAssign = async (volunteerId: string) => {
    const { error } = await supabase
      .from("requests")
      .update({ assigned_to: volunteerId })
      .eq("id", requestId);

    if (error) {
      toast.error("Failed to assign request");
    } else {
      toast.success("Request assigned successfully ✅");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-sgreen text-cgreen hover:bg-sgreen/90 border-0"
          onClick={(e:any) => e.stopPropagation()}
        >
          Assign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Request to Volunteer</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <Input
            placeholder="Search volunteer by name..."
            value={searchTerm}
            className="border-0 focus:outline-0"
            onChange={(e: any) => setSearchTerm(e.target.value)}
          />
          <ScrollArea className="max-h-64 rounded-md p-2">
            {loading ? (
              <p className="text-sm text-gray-500">Loading volunteers...</p>
            ) : volunteers.length === 0 ? (
              <p className="text-sm text-gray-500">No volunteers found.</p>
            ) : (
              <ul className="space-y-2">
                {volunteers.map((v) => (
                  <li
                    key={v.id}
                    className="p-2 rounded-md hover:bg-sgreen/40 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-black">{v.full_name}</p>
                      <p className="text-sm text-cgreen">{v.email}</p>
                      {v.phone && (
                        <p className="text-sm text-cgreen">{v.phone}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAssign(v.id)}
                      className="bg-sgreen hover:bg-sgreen/90 text-cgreen"
                    >
                      Assign
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
