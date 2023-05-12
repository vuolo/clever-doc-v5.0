export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      client: {
        Row: {
          authorized_user_ids: string[] | null
          created_at: string | null
          id: string
          last_selected: string
          name: string
          owner_id: string
          updated_at: string | null
        }
        Insert: {
          authorized_user_ids?: string[] | null
          created_at?: string | null
          id?: string
          last_selected?: string
          name: string
          owner_id: string
          updated_at?: string | null
        }
        Update: {
          authorized_user_ids?: string[] | null
          created_at?: string | null
          id?: string
          last_selected?: string
          name?: string
          owner_id?: string
          updated_at?: string | null
        }
      }
      example_note: {
        Row: {
          created_at: string
          id: string
          owner_id: string
          text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          owner_id: string
          text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          owner_id?: string
          text?: string
          updated_at?: string
        }
      }
      file_details: {
        Row: {
          category: string
          client_id: string | null
          created_at: string | null
          hash: string
          id: string
          name: string
          owner_id: string
          path: string
          size: number
          structure_description: string | null
          structure_name: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string
          client_id?: string | null
          created_at?: string | null
          hash: string
          id?: string
          name: string
          owner_id: string
          path: string
          size: number
          structure_description?: string | null
          structure_name?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          client_id?: string | null
          created_at?: string | null
          hash?: string
          id?: string
          name?: string
          owner_id?: string
          path?: string
          size?: number
          structure_description?: string | null
          structure_name?: string | null
          updated_at?: string | null
        }
      }
      file_processor: {
        Row: {
          created_at: string | null
          format: string
          id: string
          name: string
          version: string
        }
        Insert: {
          created_at?: string | null
          format: string
          id?: string
          name: string
          version: string
        }
        Update: {
          created_at?: string | null
          format?: string
          id?: string
          name?: string
          version?: string
        }
      }
      file_processor_task: {
        Row: {
          completed_at: string | null
          created_at: string | null
          file_id: string
          id: string
          initiator_id: string
          processor_id: string
          results: Json | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          file_id: string
          id?: string
          initiator_id: string
          processor_id: string
          results?: Json | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          file_id?: string
          id?: string
          initiator_id?: string
          processor_id?: string
          results?: Json | null
          status?: string
        }
      }
      user_details: {
        Row: {
          avatar_url: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
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
