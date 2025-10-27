export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          new_data: JSON | null
          old_data: JSON | null
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: JSON | null
          old_data?: JSON | null
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: JSON | null
          old_data?: JSON | null
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      deliveries: {
        Row: {
          actual_delivery_time: string | null
          created_at: string | null
          delivery_notes: string | null
          delivery_photo_url: string | null
          driver_id: string | null
          estimated_delivery_time: string | null
          id: string
          pickup_time: string | null
          recipient_signature: string | null
          request_id: string
          updated_at: string | null
        }
        Insert: {
          actual_delivery_time?: string | null
          created_at?: string | null
          delivery_notes?: string | null
          delivery_photo_url?: string | null
          driver_id?: string | null
          estimated_delivery_time?: string | null
          id?: string
          pickup_time?: string | null
          recipient_signature?: string | null
          request_id: string
          updated_at?: string | null
        }
        Update: {
          actual_delivery_time?: string | null
          created_at?: string | null
          delivery_notes?: string | null
          delivery_photo_url?: string | null
          driver_id?: string | null
          estimated_delivery_time?: string | null
          id?: string
          pickup_time?: string | null
          recipient_signature?: string | null
          request_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      donors: {
        Row: {
          created_at: string | null
          donation_type: string | null
          email: string | null
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          preferred_contact: string | null
        }
        Insert: {
          created_at?: string | null
          donation_type?: string | null
          email?: string | null
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          preferred_contact?: string | null
        }
        Update: {
          created_at?: string | null
          donation_type?: string | null
          email?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          preferred_contact?: string | null
        }
        Relationships: []
      }
      request_status_history: {
        Row: {
          changed_by: string | null
          created_at: string | null
          id: string
          new_status: string
          notes: string | null
          old_status: string | null
          request_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status: string
          notes?: string | null
          old_status?: string | null
          request_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status?: string
          notes?: string | null
          old_status?: string | null
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_status_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          assigned_to: string | null
          contact_description: string | null
          contact_email: string | null
          contact_location: string
          contact_name: string
          contact_phone: string | null
          created_at: string | null
          id: string
          internal_notes: string | null
          need_details: string | null
          need_type: string
          notes: string | null
          priority: string | null
          request_number: string
          request_title: string | null
          source: string
          status: string | null
          submitted_by: string | null
          updated_at: string | null
          zone_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          contact_description?: string | null
          contact_email?: string | null
          contact_location: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          internal_notes?: string | null
          need_details?: string | null
          need_type: string
          notes?: string | null
          priority?: string | null
          request_number: string
          request_title?: string | null
          source: string
          status?: string | null
          submitted_by?: string | null
          updated_at?: string | null
          zone_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          contact_description?: string | null
          contact_email?: string | null
          contact_location?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          internal_notes?: string | null
          need_details?: string | null
          need_type?: string
          notes?: string | null
          priority?: string | null
          request_number?: string
          request_title?: string | null
          source?: string
          status?: string | null
          submitted_by?: string | null
          updated_at?: string | null
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requests_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_conversations: {
        Row: {
          conversation_state: string | null
          created_at: string | null
          created_request_id: string | null
          current_step: string | null
          id: string
          phone_number: string
          responses: JSON | null
          updated_at: string | null
        }
        Insert: {
          conversation_state?: string | null
          created_at?: string | null
          created_request_id?: string | null
          current_step?: string | null
          id?: string
          phone_number: string
          responses?: JSON | null
          updated_at?: string | null
        }
        Update: {
          conversation_state?: string | null
          created_at?: string | null
          created_request_id?: string | null
          current_step?: string | null
          id?: string
          phone_number?: string
          responses?: JSON | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_conversations_created_request_id_fkey"
            columns: ["created_request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          phone: string | null
          role: string
          updated_at: string | null
          zone: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          phone?: string | null
          role: string
          updated_at?: string | null
          zone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role?: string
          updated_at?: string | null
          zone?: string | null
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          availability: string | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          max_delivery_distance: number | null
          skills: string[] | null
          user_id: string | null
          vehicle_type: string | null
        }
        Insert: {
          availability?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          max_delivery_distance?: number | null
          skills?: string[] | null
          user_id?: string | null
          vehicle_type?: string | null
        }
        Update: {
          availability?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          max_delivery_distance?: number | null
          skills?: string[] | null
          user_id?: string | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
      zones: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "recipient" | "driver" | "donor"
      delivery_status: "assigned" | "picked_up" | "en_route" | "delivered"
      donation_status: "pledged" | "received"
      need_type:
        | "food"
        | "clothing"
        | "medical"
        | "shelter"
        | "transportation"
        | "other"
      request_source: "public" | "admin_entered" | "donor"
      request_status:
        | "requested"
        | "assigned"
        | "picked_up"
        | "en_route"
        | "delivered"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "recipient", "driver", "donor"],
      delivery_status: ["assigned", "picked_up", "en_route", "delivered"],
      donation_status: ["pledged", "received"],
      need_type: [
        "food",
        "clothing",
        "medical",
        "shelter",
        "transportation",
        "other",
      ],
      request_source: ["public", "admin_entered", "donor"],
      request_status: [
        "requested",
        "assigned",
        "picked_up",
        "en_route",
        "delivered",
        "cancelled",
      ],
    },
  },
} as const