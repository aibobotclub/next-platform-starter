export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activation_codes: {
        Row: {
          activated_at: string | null
          code: string | null
          created_at: string | null
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          activated_at?: string | null
          code?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          activated_at?: string | null
          code?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activation_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_dividend_check_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "activation_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_taskgroup_consistency_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "activation_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "activation_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_taskgroup_activation_integrity_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "activation_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_task_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "activation_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      company_profit_log: {
        Row: {
          amount: number | null
          created_at: string | null
          dividend_id: string | null
          id: string
          order_id: string | null
          source_type: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          dividend_id?: string | null
          id?: string
          order_id?: string | null
          source_type: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          dividend_id?: string | null
          id?: string
          order_id?: string | null
          source_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      global_dividend_stat: {
        Row: {
          created_at: string | null
          credit_rebuy: number | null
          dividend_id: string
          id: string
          order_id: string | null
          reward_amount: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          credit_rebuy?: number | null
          dividend_id: string
          id?: string
          order_id?: string | null
          reward_amount?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          credit_rebuy?: number | null
          dividend_id?: string
          id?: string
          order_id?: string | null
          reward_amount?: number | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_divstat_dividend"
            columns: ["dividend_id"]
            isOneToOne: false
            referencedRelation: "admin_dividend_team_bonus_check_view"
            referencedColumns: ["dividend_id"]
          },
          {
            foreignKeyName: "fk_divstat_dividend"
            columns: ["dividend_id"]
            isOneToOne: false
            referencedRelation: "global_dividends"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_divstat_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_dividend_check_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_divstat_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_taskgroup_consistency_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_divstat_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_divstat_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_taskgroup_activation_integrity_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_divstat_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_task_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_divstat_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      global_dividends: {
        Row: {
          created_at: string | null
          id: string
          status: string | null
          task_group_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string | null
          task_group_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string | null
          task_group_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_div_task_group"
            columns: ["task_group_id"]
            isOneToOne: false
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["task_group_id"]
          },
          {
            foreignKeyName: "fk_div_task_group"
            columns: ["task_group_id"]
            isOneToOne: false
            referencedRelation: "task_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_div_task_group"
            columns: ["task_group_id"]
            isOneToOne: false
            referencedRelation: "user_task_groups_with_stats"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "fk_div_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_dividend_check_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_div_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_taskgroup_consistency_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_div_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_div_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_taskgroup_activation_integrity_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_div_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_task_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_div_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_dividend_check_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_taskgroup_consistency_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_taskgroup_activation_integrity_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_task_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          activation_code_id: string | null
          amount: number
          created_at: string | null
          credit_used: number | null
          id: string
          payment_method: string | null
          plan_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          activation_code_id?: string | null
          amount: number
          created_at?: string | null
          credit_used?: number | null
          id?: string
          payment_method?: string | null
          plan_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          activation_code_id?: string | null
          amount?: number
          created_at?: string | null
          credit_used?: number | null
          id?: string
          payment_method?: string | null
          plan_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_activation_code_id_fkey"
            columns: ["activation_code_id"]
            isOneToOne: false
            referencedRelation: "activation_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_dividend_check_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_taskgroup_consistency_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_taskgroup_activation_integrity_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_task_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_task_rewards: {
        Row: {
          amount: number
          created_at: string | null
          expires_at: string | null
          id: string
          order_id: string | null
          referred_id: string | null
          referrer_id: string | null
          status: string | null
          task_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          expires_at?: string | null
          id?: string
          order_id?: string | null
          referred_id?: string | null
          referrer_id?: string | null
          status?: string | null
          task_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          expires_at?: string | null
          id?: string
          order_id?: string | null
          referred_id?: string | null
          referrer_id?: string | null
          status?: string | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pending_task_rewards_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "admin_order_dividend_check_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "admin_order_taskgroup_consistency_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "admin_taskgroup_activation_integrity_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "user_task_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "admin_order_dividend_check_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "admin_order_taskgroup_consistency_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "admin_taskgroup_activation_integrity_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "user_task_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referred_id: string | null
          referred_username: string | null
          referred_wallet_address: string | null
          referrer_id: string | null
          referrer_username: string | null
          referrer_wallet_address: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referred_id?: string | null
          referred_username?: string | null
          referred_wallet_address?: string | null
          referrer_id?: string | null
          referrer_username?: string | null
          referrer_wallet_address?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referred_id?: string | null
          referred_username?: string | null
          referred_wallet_address?: string | null
          referrer_id?: string | null
          referrer_username?: string | null
          referrer_wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "admin_order_dividend_check_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "admin_order_taskgroup_consistency_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "admin_taskgroup_activation_integrity_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "user_task_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "admin_order_dividend_check_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "admin_order_taskgroup_consistency_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "admin_taskgroup_activation_integrity_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "user_task_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_details: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          order_id: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reward_details_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_dividend_check_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "reward_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_taskgroup_consistency_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "reward_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "reward_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_taskgroup_activation_integrity_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "reward_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_task_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "reward_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      task_groups: {
        Row: {
          completed_at: string | null
          created_at: string | null
          global_dividend_id: string | null
          id: string
          order_id: string | null
          status: Database["public"]["Enums"]["task_group_status"] | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          global_dividend_id?: string | null
          id?: string
          order_id?: string | null
          status?: Database["public"]["Enums"]["task_group_status"] | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          global_dividend_id?: string | null
          id?: string
          order_id?: string | null
          status?: Database["public"]["Enums"]["task_group_status"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_taskgroup_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_dividend_check_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "task_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_taskgroup_consistency_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "task_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "task_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_taskgroup_activation_integrity_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "task_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_task_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "task_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string | null
          group_id: string | null
          id: string
          reward: number | null
          status: Database["public"]["Enums"]["task_status"] | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          group_id?: string | null
          id?: string
          reward?: number | null
          status?: Database["public"]["Enums"]["task_status"] | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          group_id?: string | null
          id?: string
          reward?: number | null
          status?: Database["public"]["Enums"]["task_status"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["task_group_id"]
          },
          {
            foreignKeyName: "tasks_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "task_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "user_task_groups_with_stats"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_dividend_check_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_taskgroup_consistency_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_taskgroup_activation_integrity_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_task_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      team_bonus_rewards: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          from_user_id: string | null
          id: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          from_user_id?: string | null
          id?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          from_user_id?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string | null
          description: string | null
          id: string
          status: string
          tx_hash: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          status: string
          tx_hash?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string
          tx_hash?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_dividend_check_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_taskgroup_consistency_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_taskgroup_activation_integrity_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_task_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_balance: {
        Row: {
          credit_balance: number | null
          reward_balance: number | null
          total_credit: number | null
          total_rewards: number | null
          updated_at: string | null
          user_id: string
          withdrawn_amount: number | null
        }
        Insert: {
          credit_balance?: number | null
          reward_balance?: number | null
          total_credit?: number | null
          total_rewards?: number | null
          updated_at?: string | null
          user_id: string
          withdrawn_amount?: number | null
        }
        Update: {
          credit_balance?: number | null
          reward_balance?: number | null
          total_credit?: number | null
          total_rewards?: number | null
          updated_at?: string | null
          user_id?: string
          withdrawn_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_balance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "admin_order_dividend_check_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_balance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "admin_order_taskgroup_consistency_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_balance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_balance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "admin_taskgroup_activation_integrity_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_balance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_task_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_balance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          email_confirmed_at: string | null
          id: string
          password_hash: string
          rank: number | null
          updated_at: string | null
          username: string | null
          wallet_address: string
        }
        Insert: {
          created_at?: string | null
          email: string
          email_confirmed_at?: string | null
          id?: string
          password_hash: string
          rank?: number | null
          updated_at?: string | null
          username?: string | null
          wallet_address: string
        }
        Update: {
          created_at?: string | null
          email?: string
          email_confirmed_at?: string | null
          id?: string
          password_hash?: string
          rank?: number | null
          updated_at?: string | null
          username?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_dividend_team_bonus_check_view: {
        Row: {
          created_at: string | null
          dividend_id: string | null
          fixable: boolean | null
          has_team_bonus: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          dividend_id?: string | null
          fixable?: never
          has_team_bonus?: never
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          dividend_id?: string | null
          fixable?: never
          has_team_bonus?: never
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_div_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_dividend_check_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_div_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_taskgroup_consistency_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_div_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_div_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_taskgroup_activation_integrity_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_div_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_task_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_div_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_order_dividend_check_view: {
        Row: {
          active_task_groups: number | null
          dividend_received_count: number | null
          order_count: number | null
          user_id: string | null
          wallet_address: string | null
        }
        Insert: {
          active_task_groups?: never
          dividend_received_count?: never
          order_count?: never
          user_id?: string | null
          wallet_address?: string | null
        }
        Update: {
          active_task_groups?: never
          dividend_received_count?: never
          order_count?: never
          user_id?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      admin_order_taskgroup_consistency_view: {
        Row: {
          active_task_groups: number | null
          is_consistent: boolean | null
          total_orders: number | null
          user_id: string | null
          wallet_address: string | null
        }
        Insert: {
          active_task_groups?: never
          is_consistent?: never
          total_orders?: never
          user_id?: string | null
          wallet_address?: string | null
        }
        Update: {
          active_task_groups?: never
          is_consistent?: never
          total_orders?: never
          user_id?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      admin_task_anomaly_view: {
        Row: {
          expected_task_count: number | null
          has_task_group: boolean | null
          issue: string | null
          task_count: number | null
          task_group_id: string | null
          task_group_status:
            | Database["public"]["Enums"]["task_group_status"]
            | null
          user_id: string | null
          wallet_address: string | null
        }
        Relationships: []
      }
      admin_taskgroup_activation_integrity_view: {
        Row: {
          active_groups: number | null
          has_backup_group: boolean | null
          inactive_groups: number | null
          issue: string | null
          user_id: string | null
          wallet_address: string | null
        }
        Relationships: []
      }
      expired_reward_notifications_view: {
        Row: {
          amount: number | null
          expires_at: string | null
          notice_sent_at: string | null
          referred_id: string | null
          referred_username: string | null
          referrer_id: string | null
          referrer_notice: string | null
          referrer_username: string | null
          reward_created_at: string | null
          reward_id: string | null
          status: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pending_task_rewards_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "admin_order_dividend_check_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "admin_order_taskgroup_consistency_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "admin_taskgroup_activation_integrity_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "user_task_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "admin_order_dividend_check_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "admin_order_taskgroup_consistency_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "admin_taskgroup_activation_integrity_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "user_task_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pending_task_rewards_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      task_status_summary: {
        Row: {
          completed: number | null
          not_completed: number | null
          pending: number | null
          total_tasks: number | null
          unstarted: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_dividend_check_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_taskgroup_consistency_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_taskgroup_activation_integrity_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_task_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_referral_tree_view: {
        Row: {
          full_path: string | null
          level: number | null
          parent_id: string | null
          parent_name: string | null
          user_id: string | null
          user_name: string | null
          user_rank: number | null
        }
        Relationships: []
      }
      user_task_groups_with_stats: {
        Row: {
          completed_count: number | null
          created_at: string | null
          global_dividend_id: string | null
          group_completed_at: string | null
          group_id: string | null
          group_status: Database["public"]["Enums"]["task_group_status"] | null
          task_count: number | null
          total_reward: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_dividend_check_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "task_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_order_taskgroup_consistency_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "task_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_task_anomaly_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "task_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_taskgroup_activation_integrity_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "task_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_task_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "task_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_task_stats: {
        Row: {
          claimed_reward_count: number | null
          completed_tasks: number | null
          global_dividend_count: number | null
          total_claimed_reward: number | null
          total_reward: number | null
          total_task_groups: number | null
          total_tasks: number | null
          user_id: string | null
          wallet_address: string | null
        }
        Insert: {
          claimed_reward_count?: never
          completed_tasks?: never
          global_dividend_count?: never
          total_claimed_reward?: never
          total_reward?: never
          total_task_groups?: never
          total_tasks?: never
          user_id?: string | null
          wallet_address?: string | null
        }
        Update: {
          claimed_reward_count?: never
          completed_tasks?: never
          global_dividend_count?: never
          total_claimed_reward?: never
          total_reward?: never
          total_task_groups?: never
          total_tasks?: never
          user_id?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_and_trigger_global_dividend: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_new_task_group_with_tasks: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      expire_pending_task_rewards: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      fix_all_missing_team_bonuses: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      fix_missing_team_bonus: {
        Args: { dividend_id: string }
        Returns: undefined
      }
      fix_user_missing_taskgroups: {
        Args: { user_id: string }
        Returns: undefined
      }
      process_global_dividend_reward: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      task_group_status: "inactive" | "active" | "completed"
      task_status: "unstarted" | "pending" | "completed" | "not_completed"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      task_group_status: ["inactive", "active", "completed"],
      task_status: ["unstarted", "pending", "completed", "not_completed"],
    },
  },
} as const
