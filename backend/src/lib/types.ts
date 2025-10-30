// Database types for Supabase

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          privy_user_id: string;
          auth_type: 'email' | 'wallet';
          email: string | null;
          last_login: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          privy_user_id: string;
          auth_type: 'email' | 'wallet';
          email?: string | null;
          last_login?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          privy_user_id?: string;
          auth_type?: 'email' | 'wallet';
          email?: string | null;
          last_login?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_wallets: {
        Row: {
          id: string;
          user_id: string;
          wallet_address: string;
          wallet_provider: string;
          network: string;
          wallet_type: 'embedded' | 'external';
          privy_wallet_id: string | null;
          is_primary: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          wallet_address: string;
          wallet_provider?: string;
          network?: string;
          wallet_type?: 'embedded' | 'external';
          privy_wallet_id?: string | null;
          is_primary?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          wallet_address?: string;
          wallet_provider?: string;
          network?: string;
          wallet_type?: 'embedded' | 'external';
          privy_wallet_id?: string | null;
          is_primary?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      token_holders: {
        Row: {
          user_id: string;
          balance: string;
          locked: string;
          staked: string;
          rewards: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          balance?: string;
          locked?: string;
          staked?: string;
          rewards?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          balance?: string;
          locked?: string;
          staked?: string;
          rewards?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      token_transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'mint' | 'burn' | 'transfer' | 'claim' | 'stake' | 'unstake' | 'reward';
          amount: string;
          from_user: string | null;
          to_user: string | null;
          reason: string;
          tx_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'mint' | 'burn' | 'transfer' | 'claim' | 'stake' | 'unstake' | 'reward';
          amount: string;
          from_user?: string | null;
          to_user?: string | null;
          reason: string;
          tx_hash?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'mint' | 'burn' | 'transfer' | 'claim' | 'stake' | 'unstake' | 'reward';
          amount?: string;
          from_user?: string | null;
          to_user?: string | null;
          reason?: string;
          tx_hash?: string | null;
          created_at?: string;
        };
      };
      funding_rounds: {
        Row: {
          id: string;
          name: 'seed' | 'strategic' | 'public';
          price_per_token: string;
          discount_percent: string;
          min_investment: string;
          max_investment: string;
          target_raise: string;
          current_raise: string;
          start_time: string;
          end_time: string;
          vesting_months: number;
          cliff_months: number;
          status: 'upcoming' | 'active' | 'completed' | 'cancelled';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: 'seed' | 'strategic' | 'public';
          price_per_token: string;
          discount_percent: string;
          min_investment: string;
          max_investment: string;
          target_raise: string;
          current_raise?: string;
          start_time: string;
          end_time: string;
          vesting_months: number;
          cliff_months: number;
          status?: 'upcoming' | 'active' | 'completed' | 'cancelled';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: 'seed' | 'strategic' | 'public';
          price_per_token?: string;
          discount_percent?: string;
          min_investment?: string;
          max_investment?: string;
          target_raise?: string;
          current_raise?: string;
          start_time?: string;
          end_time?: string;
          vesting_months?: number;
          cliff_months?: number;
          status?: 'upcoming' | 'active' | 'completed' | 'cancelled';
          created_at?: string;
        };
      };
      investments: {
        Row: {
          id: string;
          user_id: string;
          round_id: string;
          round_name: 'seed' | 'strategic' | 'public';
          investment_amount: string;
          token_amount: string;
          price_per_token: string;
          vesting_total: string;
          vesting_start_time: string;
          vesting_cliff_end_time: string;
          vesting_end_time: string;
          claimed_amount: string;
          remaining_amount: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          round_id: string;
          round_name: 'seed' | 'strategic' | 'public';
          investment_amount: string;
          token_amount: string;
          price_per_token: string;
          vesting_total: string;
          vesting_start_time: string;
          vesting_cliff_end_time: string;
          vesting_end_time: string;
          claimed_amount?: string;
          remaining_amount?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          round_id?: string;
          round_name?: 'seed' | 'strategic' | 'public';
          investment_amount?: string;
          token_amount?: string;
          price_per_token?: string;
          vesting_total?: string;
          vesting_start_time?: string;
          vesting_cliff_end_time?: string;
          vesting_end_time?: string;
          claimed_amount?: string;
          remaining_amount?: string;
          created_at?: string;
        };
      };
      indices: {
        Row: {
          id: string;
          layer: 'L1' | 'L2' | 'L3';
          symbol: string;
          name: string;
          description: string;
          management_fee: string;
          performance_fee: string | null;
          status: 'active' | 'paused' | 'graduated' | 'deprecated';
          total_value_locked: string;
          holders: number;
          volume_24h: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          layer: 'L1' | 'L2' | 'L3';
          symbol: string;
          name: string;
          description: string;
          management_fee: string;
          performance_fee?: string | null;
          status?: 'active' | 'paused' | 'graduated' | 'deprecated';
          total_value_locked?: string;
          holders?: number;
          volume_24h?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          layer?: 'L1' | 'L2' | 'L3';
          symbol?: string;
          name?: string;
          description?: string;
          management_fee?: string;
          performance_fee?: string | null;
          status?: 'active' | 'paused' | 'graduated' | 'deprecated';
          total_value_locked?: string;
          holders?: number;
          volume_24h?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      index_components: {
        Row: {
          id: string;
          index_id: string;
          symbol: string;
          address: string;
          weight: string;
          chain_id: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          index_id: string;
          symbol: string;
          address: string;
          weight: string;
          chain_id?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          index_id?: string;
          symbol?: string;
          address?: string;
          weight?: string;
          chain_id?: number;
          created_at?: string;
        };
      };
      bonding_curve_params: {
        Row: {
          index_id: string;
          curve_type: 'linear' | 'exponential' | 'sigmoid' | 'hybrid';
          base_price: string;
          linear_slope: string | null;
          max_price: string | null;
          sigmoid_slope: string | null;
          midpoint: string | null;
          transition_point: string | null;
          target_market_cap: string;
          current_price: string;
          current_market_cap: string;
          total_raised: string;
          progress: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          index_id: string;
          curve_type: 'linear' | 'exponential' | 'sigmoid' | 'hybrid';
          base_price: string;
          linear_slope?: string | null;
          max_price?: string | null;
          sigmoid_slope?: string | null;
          midpoint?: string | null;
          transition_point?: string | null;
          target_market_cap: string;
          current_price?: string;
          current_market_cap?: string;
          total_raised?: string;
          progress?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          index_id?: string;
          curve_type?: 'linear' | 'exponential' | 'sigmoid' | 'hybrid';
          base_price?: string;
          linear_slope?: string | null;
          max_price?: string | null;
          sigmoid_slope?: string | null;
          midpoint?: string | null;
          transition_point?: string | null;
          target_market_cap?: string;
          current_price?: string;
          current_market_cap?: string;
          total_raised?: string;
          progress?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
