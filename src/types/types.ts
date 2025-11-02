import { IUser } from "@/store/AuthSlice";

export enum Role {
  RECIPIENT = "recipient",
  ADMIN = "admin",
  DONOR = "donor",
  DRIVER = "driver",
}
export interface SignUpData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  full_name?: string;
  zone: string;
  profile_picture?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
export interface IRequest {
  id: string;
  request_number: string;
  need_type: string;
  priority: string;
  status: string;
  source: string;
  zone: string;
  contact_name: string | null;
  contact_information: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_location: string | null;
  contact_description: string | null;
  need_details: string | null;
  notes: string | null;
  internal_notes: string | null;
  assigned_to: string | null;
  submitted_by: string | null;
  request_title: string | null;
  created_at: string;
  updated_at: string;
  assigned_user: IUser | null;
}
