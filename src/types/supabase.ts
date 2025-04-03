
export interface Profile {
  id: string;
  name: string;
  created_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  account_number: string;
  balance: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  source_account_id: string | null;
  destination_account_id: string | null;
  amount: number;
  description: string | null;
  status: string;
  created_at: string;
  sender_name?: string;
}
