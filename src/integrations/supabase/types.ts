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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      chat_history: {
        Row: {
          created_at: string
          id: string
          message: string
          message_type: string | null
          metadata: Json | null
          sender_type: string
          timestamp: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          message_type?: string | null
          metadata?: Json | null
          sender_type: string
          timestamp?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          message_type?: string | null
          metadata?: Json | null
          sender_type?: string
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      daily_guidance: {
        Row: {
          completed_tasks: string[] | null
          created_at: string
          date: string
          id: string
          mood_check: Json | null
          morning_routine: Json | null
          nutrition_advice: string | null
          updated_at: string
          user_id: string
          wellness_tips: Json | null
          workout_suggestion: string | null
        }
        Insert: {
          completed_tasks?: string[] | null
          created_at?: string
          date?: string
          id?: string
          mood_check?: Json | null
          morning_routine?: Json | null
          nutrition_advice?: string | null
          updated_at?: string
          user_id: string
          wellness_tips?: Json | null
          workout_suggestion?: string | null
        }
        Update: {
          completed_tasks?: string[] | null
          created_at?: string
          date?: string
          id?: string
          mood_check?: Json | null
          morning_routine?: Json | null
          nutrition_advice?: string | null
          updated_at?: string
          user_id?: string
          wellness_tips?: Json | null
          workout_suggestion?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string
          display_name: string | null
          fitness_level: string | null
          id: string
          preferences: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          fitness_level?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          fitness_level?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      progress_tracking: {
        Row: {
          created_at: string
          date: string
          id: string
          metric_type: string
          notes: string | null
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          metric_type: string
          notes?: string | null
          user_id: string
          value: number
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          metric_type?: string
          notes?: string | null
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      scan_results: {
        Row: {
          analysis_data: Json
          confidence_score: number | null
          created_at: string
          id: string
          image_url: string | null
          recommendations: Json | null
          scan_type: string
          user_id: string
        }
        Insert: {
          analysis_data?: Json
          confidence_score?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          recommendations?: Json | null
          scan_type: string
          user_id: string
        }
        Update: {
          analysis_data?: Json
          confidence_score?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          recommendations?: Json | null
          scan_type?: string
          user_id?: string
        }
        Relationships: []
      }
      todo_lists: {
        Row: {
          category: string | null
          completed: boolean | null
          created_at: string
          day_of_week: number | null
          description: string | null
          due_date: string | null
          id: string
          priority: number | null
          protein_amount: number | null
          task: string
          updated_at: string
          user_id: string
          workout_type: string | null
        }
        Insert: {
          category?: string | null
          completed?: boolean | null
          created_at?: string
          day_of_week?: number | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: number | null
          protein_amount?: number | null
          task: string
          updated_at?: string
          user_id: string
          workout_type?: string | null
        }
        Update: {
          category?: string | null
          completed?: boolean | null
          created_at?: string
          day_of_week?: number | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: number | null
          protein_amount?: number | null
          task?: string
          updated_at?: string
          user_id?: string
          workout_type?: string | null
        }
        Relationships: []
      }
      wellness_checkups: {
        Row: {
          created_at: string
          id: string
          recommendations: Json | null
          responses: Json
          risk_level: string | null
          score: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          recommendations?: Json | null
          responses: Json
          risk_level?: string | null
          score?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          recommendations?: Json | null
          responses?: Json
          risk_level?: string | null
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      workout_plans: {
        Row: {
          created_at: string
          description: string | null
          difficulty: string | null
          duration_minutes: number | null
          exercises: Json
          id: string
          is_active: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty?: string | null
          duration_minutes?: number | null
          exercises?: Json
          id?: string
          is_active?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: string | null
          duration_minutes?: number | null
          exercises?: Json
          id?: string
          is_active?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workout_sessions: {
        Row: {
          calories_burned: number | null
          completed_at: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          notes: string | null
          rating: number | null
          started_at: string
          user_id: string
          workout_plan_id: string | null
        }
        Insert: {
          calories_burned?: number | null
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          rating?: number | null
          started_at?: string
          user_id: string
          workout_plan_id?: string | null
        }
        Update: {
          calories_burned?: number | null
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          rating?: number | null
          started_at?: string
          user_id?: string
          workout_plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      weekly_workout_schedule: {
        Row: {
          day_of_week: number | null
          exercise_count: number | null
          exercises: string | null
          user_id: string | null
          workout_type: string | null
        }
        Relationships: []
      }
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
