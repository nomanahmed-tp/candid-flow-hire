export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      candidates: {
        Row: {
          applied_date: string | null
          created_at: string | null
          current_stage: string
          email: string
          id: string
          image_url: string | null
          name: string
          phone: string | null
          role: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          applied_date?: string | null
          created_at?: string | null
          current_stage: string
          email: string
          id?: string
          image_url?: string | null
          name: string
          phone?: string | null
          role: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          applied_date?: string | null
          created_at?: string | null
          current_stage?: string
          email?: string
          id?: string
          image_url?: string | null
          name?: string
          phone?: string | null
          role?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_current_stage_fkey"
            columns: ["current_stage"]
            isOneToOne: false
            referencedRelation: "stage_config"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          candidate_id: string
          created_at: string | null
          date: string | null
          id: string
          interviewer_id: string
          interviewer_name: string
          notes: string | null
          rating: number
          stage: string
          updated_at: string | null
        }
        Insert: {
          candidate_id: string
          created_at?: string | null
          date?: string | null
          id?: string
          interviewer_id: string
          interviewer_name: string
          notes?: string | null
          rating: number
          stage: string
          updated_at?: string | null
        }
        Update: {
          candidate_id?: string
          created_at?: string | null
          date?: string | null
          id?: string
          interviewer_id?: string
          interviewer_name?: string
          notes?: string | null
          rating?: number
          stage?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_stage_fkey"
            columns: ["stage"]
            isOneToOne: false
            referencedRelation: "stage_config"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          candidate_id: string
          candidate_name: string
          created_at: string | null
          duration: number
          id: string
          interviewers: string[]
          job_id: string
          job_title: string
          notes: string | null
          scheduled_date: string
          stage: string
          status: string
          updated_at: string | null
        }
        Insert: {
          candidate_id: string
          candidate_name: string
          created_at?: string | null
          duration: number
          id?: string
          interviewers: string[]
          job_id: string
          job_title: string
          notes?: string | null
          scheduled_date: string
          stage: string
          status: string
          updated_at?: string | null
        }
        Update: {
          candidate_id?: string
          candidate_name?: string
          created_at?: string | null
          duration?: number
          id?: string
          interviewers?: string[]
          job_id?: string
          job_title?: string
          notes?: string | null
          scheduled_date?: string
          stage?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interviews_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_stage_fkey"
            columns: ["stage"]
            isOneToOne: false
            referencedRelation: "stage_config"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          applicants: number | null
          created_at: string | null
          date_posted: string | null
          department: string
          id: string
          location: string
          status: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          applicants?: number | null
          created_at?: string | null
          date_posted?: string | null
          department: string
          id?: string
          location: string
          status: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          applicants?: number | null
          created_at?: string | null
          date_posted?: string | null
          department?: string
          id?: string
          location?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      stage_config: {
        Row: {
          color: string
          id: string
          label: string
          sort_order: number
        }
        Insert: {
          color: string
          id: string
          label: string
          sort_order: number
        }
        Update: {
          color?: string
          id?: string
          label?: string
          sort_order?: number
        }
        Relationships: []
      }
      stats: {
        Row: {
          active_jobs: number | null
          average_days_to_hire: number | null
          id: string
          last_updated: string | null
          new_candidates_this_week: number | null
          scheduled_interviews: number | null
          total_candidates: number | null
          total_jobs: number | null
        }
        Insert: {
          active_jobs?: number | null
          average_days_to_hire?: number | null
          id?: string
          last_updated?: string | null
          new_candidates_this_week?: number | null
          scheduled_interviews?: number | null
          total_candidates?: number | null
          total_jobs?: number | null
        }
        Update: {
          active_jobs?: number | null
          average_days_to_hire?: number | null
          id?: string
          last_updated?: string | null
          new_candidates_this_week?: number | null
          scheduled_interviews?: number | null
          total_candidates?: number | null
          total_jobs?: number | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
