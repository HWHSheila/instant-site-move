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
      baseline_submissions: {
        Row: {
          bloating: number
          bowel_regularity: number
          brain_fog: number
          cravings: number
          created_at: string
          digestion: number
          email: string
          energy: number
          first_name: string
          id: string
          joint_pain: number
          last_name: string
          mood: number
          muscle_body_aches: number
          sleep: number
          stress_level: number
          top_3_symptoms: string | null
        }
        Insert: {
          bloating: number
          bowel_regularity: number
          brain_fog: number
          cravings: number
          created_at?: string
          digestion: number
          email: string
          energy: number
          first_name: string
          id?: string
          joint_pain: number
          last_name: string
          mood: number
          muscle_body_aches: number
          sleep: number
          stress_level: number
          top_3_symptoms?: string | null
        }
        Update: {
          bloating?: number
          bowel_regularity?: number
          brain_fog?: number
          cravings?: number
          created_at?: string
          digestion?: number
          email?: string
          energy?: number
          first_name?: string
          id?: string
          joint_pain?: number
          last_name?: string
          mood?: number
          muscle_body_aches?: number
          sleep?: number
          stress_level?: number
          top_3_symptoms?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
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
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      portal_videos: {
        Row: {
          id: string
          video_code: string
          title: string
          phase: string
          sub_category: string
          sequence_order: number
          is_foundation_layer: boolean
          production_status: string
          secondary_strength: string | null
          video_url: string | null
          supabase_storage_path: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          video_code: string
          title: string
          phase: string
          sub_category: string
          sequence_order?: number
          is_foundation_layer?: boolean
          production_status?: string
          secondary_strength?: string | null
          video_url?: string | null
          supabase_storage_path?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          video_code?: string
          title?: string
          phase?: string
          sub_category?: string
          sequence_order?: number
          is_foundation_layer?: boolean
          production_status?: string
          secondary_strength?: string | null
          video_url?: string | null
          supabase_storage_path?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      portal_video_scripts: {
        Row: {
          id: string
          video_code: string
          learning_objective: string | null
          introduction: string | null
          core_educational_content: string | null
          practical_application: string | null
          gmh_cascade_connection: string | null
          transition: string | null
          action_items: Json
          reflection_prompt: string | null
          generated_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          video_code: string
          learning_objective?: string | null
          introduction?: string | null
          core_educational_content?: string | null
          practical_application?: string | null
          gmh_cascade_connection?: string | null
          transition?: string | null
          action_items?: Json
          reflection_prompt?: string | null
          generated_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          video_code?: string
          learning_objective?: string | null
          introduction?: string | null
          core_educational_content?: string | null
          practical_application?: string | null
          gmh_cascade_connection?: string | null
          transition?: string | null
          action_items?: Json
          reflection_prompt?: string | null
          generated_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_video_scripts_video_code_fkey"
            columns: ["video_code"]
            isOneToOne: true
            referencedRelation: "portal_videos"
            referencedColumns: ["video_code"]
          }
        ]
      }
      wellness_assessments: {
        Row: {
          id: string
          subscriber_id: string
          status: string
          current_step: number
          first_name: string | null
          age: number | null
          location: string | null
          primary_health_goal: string | null
          why_now: string | null
          past_diagnoses: Json
          past_diagnoses_other: string | null
          surgeries_hospitalizations: boolean | null
          surgeries_detail: string | null
          chronic_conditions: Json
          chronic_conditions_other: string | null
          pregnancy_count: number | null
          delivery_count: number | null
          miscarriage_count: number | null
          head_injury_history: boolean | null
          current_rx: string | null
          current_otc: string | null
          current_supplements: string | null
          past_rx: string | null
          past_otc: string | null
          past_supplements: string | null
          childhood_antibiotics: string | null
          adult_antibiotics: string | null
          adult_antibiotics_detail: string | null
          ppi_history: string | null
          hormonal_contraceptive_history: boolean | null
          hormonal_contraceptive_detail: string | null
          family_conditions: Json
          family_autoimmune: string | null
          family_thyroid: string | null
          family_metabolic: string | null
          birth_type: string | null
          infant_feeding: string | null
          childhood_antibiotics_early: string | null
          childhood_illness: boolean | null
          childhood_illness_detail: string | null
          childhood_trauma: boolean | null
          childhood_trauma_detail: string | null
          symptoms_gut: Json
          symptoms_metabolic: Json
          symptoms_hormonal: Json
          symptoms_neuro: Json
          symptoms_skin: Json
          symptoms_cardio: Json
          symptoms_sexual: Json
          symptoms_systemic: Json
          meals_per_day: string | null
          meal_timing: string | null
          water_intake: string | null
          caffeine_intake: string | null
          alcohol_intake: string | null
          food_sensitivities: string | null
          diets_tried: Json
          food_relationship: string | null
          eating_causes_symptoms: string | null
          avg_bedtime: string | null
          avg_wake_time: string | null
          avg_sleep_hours: string | null
          sleep_quality: string | null
          trouble_falling_asleep: string | null
          trouble_staying_asleep: string | null
          wake_to_urinate: string | null
          feel_rested: string | null
          shift_work: boolean | null
          stress_level: number | null
          stress_sources: Json
          anxiety_depression_history: string | null
          trauma_history: string | null
          coping_mechanisms: Json
          support_system: string | null
          sense_of_purpose: string | null
          activity_level: string | null
          exercise_type: string | null
          exercise_frequency: string | null
          sitting_hours: string | null
          movement_barriers: Json
          mold_exposure: string | null
          chemical_exposure: boolean | null
          water_source: string | null
          personal_care: string | null
          travel_exposure: boolean | null
          lab_tsh: string | null
          lab_free_t3: string | null
          lab_free_t4: string | null
          lab_tpo_antibodies: string | null
          lab_thyroid_diagnosis: string | null
          lab_fasting_glucose: string | null
          lab_fasting_insulin: string | null
          lab_hba1c: string | null
          lab_triglycerides: string | null
          lab_hdl: string | null
          lab_alt_ast: string | null
          lab_estrogen: string | null
          lab_progesterone: string | null
          lab_cortisol: string | null
          lab_dheas: string | null
          lab_testosterone: string | null
          lab_crp: string | null
          lab_esr: string | null
          lab_homocysteine: string | null
          lab_gi_map: string | null
          lab_sibo: string | null
          lab_food_sensitivity: string | null
          lab_ferritin: string | null
          lab_vitamin_d: string | null
          lab_b12: string | null
          lab_magnesium: string | null
          lab_other: string | null
          baseline_ratings: Json
          baseline_open_text: Json
          started_at: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subscriber_id: string
          status?: string
          current_step?: number
          [key: string]: any
        }
        Update: {
          [key: string]: any
        }
        Relationships: []
      }
      assessment_consents: {
        Row: {
          id: string
          subscriber_id: string
          assessment_id: string
          consent_text: string
          consented_at: string
          ip_address: string | null
        }
        Insert: {
          id?: string
          subscriber_id: string
          assessment_id: string
          consent_text: string
          consented_at?: string
          ip_address?: string | null
        }
        Update: {
          [key: string]: any
        }
        Relationships: []
      }
      member_roadmaps: {
        Row: {
          id: string
          subscriber_id: string
          assessment_id: string | null
          phase_sequence: Json
          included_subcategories: Json
          primary_pattern: string | null
          secondary_pattern: string | null
          atm_reasoning: string | null
          recommended_tier: string | null
          tier_reasoning: string | null
          current_phase: string | null
          current_subcategory: string | null
          started_at: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subscriber_id: string
          [key: string]: any
        }
        Update: {
          [key: string]: any
        }
        Relationships: []
      }
      member_content_progress: {
        Row: {
          id: string
          subscriber_id: string
          video_code: string
          content_type: string
          status: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subscriber_id: string
          video_code: string
          content_type?: string
          status?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subscriber_id?: string
          video_code?: string
          content_type?: string
          status?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      mini_assessments: {
        Row: {
          id: string
          subscriber_id: string
          assessment_type: string
          day_number: number | null
          ratings: Json
          open_text_improved: string | null
          open_text_challenging: string | null
          open_text_note_to_sheila: string | null
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          subscriber_id: string
          assessment_type: string
          day_number?: number | null
          ratings?: Json
          open_text_improved?: string | null
          open_text_challenging?: string | null
          open_text_note_to_sheila?: string | null
          completed_at?: string
          created_at?: string
        }
        Update: {
          [key: string]: any
        }
        Relationships: []
      }
      symptom_logs: {
        Row: {
          id: string
          subscriber_id: string
          log_text: string
          logged_at: string
        }
        Insert: {
          id?: string
          subscriber_id: string
          log_text: string
          logged_at?: string
        }
        Update: {
          [key: string]: any
        }
        Relationships: []
      }
      ai_coach_usage: {
        Row: {
          id: string
          subscriber_id: string
          question: string
          response: string | null
          billing_month: string
          created_at: string
        }
        Insert: {
          id?: string
          subscriber_id: string
          question: string
          response?: string | null
          billing_month: string
          created_at?: string
        }
        Update: {
          [key: string]: any
        }
        Relationships: []
      }
      priority_support_messages: {
        Row: {
          id: string
          subscriber_id: string
          direction: string
          message_text: string
          billing_month: string
          created_at: string
        }
        Insert: {
          id?: string
          subscriber_id: string
          direction: string
          message_text: string
          billing_month: string
          created_at?: string
        }
        Update: {
          [key: string]: any
        }
        Relationships: []
      }
      mailer_lite_trigger_log: {
        Row: {
          id: string
          subscriber_id: string
          trigger_name: string
          trigger_data: Json
          fired_at: string
        }
        Insert: {
          id?: string
          subscriber_id: string
          trigger_name: string
          trigger_data?: Json
          fired_at?: string
        }
        Update: {
          [key: string]: any
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
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
