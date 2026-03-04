export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      strategy_intake_submissions: {
        Row: {
          bowel_frequency: string | null
          call_date_time: string
          craving_timing: string[] | null
          craving_types: string[] | null
          created_at: string
          cycle_patterns: string[] | null
          desired_clarity: string | null
          desired_outcomes: string | null
          diagnoses: string | null
          digestive_other: string | null
          digestive_symptoms: string[] | null
          email: string
          energy_patterns: string[] | null
          food_triggers: string[] | null
          full_name: string
          has_cravings: string | null
          has_recent_labs: string | null
          hormonal_symptoms: string[] | null
          id: string
          lab_details: string | null
          medications_supplements: string | null
          nervous_system: string[] | null
          open_to_coaching: string | null
          phone: string | null
          stool_consistency: string | null
          timing_pattern: string[] | null
          tried_approaches: string | null
          weight_fluid_patterns: string[] | null
          what_helped: string | null
          what_worsened: string | null
        }
        Insert: {
          bowel_frequency?: string | null
          call_date_time: string
          craving_timing?: string[] | null
          craving_types?: string[] | null
          created_at?: string
          cycle_patterns?: string[] | null
          desired_clarity?: string | null
          desired_outcomes?: string | null
          diagnoses?: string | null
          digestive_other?: string | null
          digestive_symptoms?: string[] | null
          email: string
          energy_patterns?: string[] | null
          food_triggers?: string[] | null
          full_name: string
          has_cravings?: string | null
          has_recent_labs?: string | null
          hormonal_symptoms?: string[] | null
          id?: string
          lab_details?: string | null
          medications_supplements?: string | null
          nervous_system?: string[] | null
          open_to_coaching?: string | null
          phone?: string | null
          stool_consistency?: string | null
          timing_pattern?: string[] | null
          tried_approaches?: string | null
          weight_fluid_patterns?: string[] | null
          what_helped?: string | null
          what_worsened?: string | null
        }
        Update: {
          bowel_frequency?: string | null
          call_date_time?: string
          craving_timing?: string[] | null
          craving_types?: string[] | null
          created_at?: string
          cycle_patterns?: string[] | null
          desired_clarity?: string | null
          desired_outcomes?: string | null
          diagnoses?: string | null
          digestive_other?: string | null
          digestive_symptoms?: string[] | null
          email?: string
          energy_patterns?: string[] | null
          food_triggers?: string[] | null
          full_name?: string
          has_cravings?: string | null
          has_recent_labs?: string | null
          hormonal_symptoms?: string[] | null
          id?: string
          lab_details?: string | null
          medications_supplements?: string | null
          nervous_system?: string[] | null
          open_to_coaching?: string | null
          phone?: string | null
          stool_consistency?: string | null
          timing_pattern?: string[] | null
          tried_approaches?: string | null
          weight_fluid_patterns?: string[] | null
          what_helped?: string | null
          what_worsened?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
