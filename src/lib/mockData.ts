
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Na vida real, seria um hash
  createdAt: Date;
}

export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  balance: number;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

// Dados mockados para simulação
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "João Silva",
    email: "joao@exemplo.com",
    password: "senha123", // Seria um hash na vida real
    createdAt: new Date("2023-01-15")
  },
  {
    id: "user-2", 
    name: "Maria Oliveira",
    email: "maria@exemplo.com",
    password: "senha123",
    createdAt: new Date("2023-02-20")
  }
];

export const mockAccounts: Account[] = [
  {
    id: "account-1",
    userId: "user-1",
    accountNumber: "1001",
    balance: 5000.00,
    createdAt: new Date("2023-01-15")
  },
  {
    id: "account-2",
    userId: "user-2",
    accountNumber: "1002", 
    balance: 3500.00,
    createdAt: new Date("2023-02-20")
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    sourceAccountId: "account-1",
    destinationAccountId: "account-2",
    amount: 250.00,
    date: new Date("2023-05-10T14:30:00"),
    status: "completed",
    description: "Pagamento de aluguel"
  },
  {
    id: "tx-2",
    sourceAccountId: "account-2",
    destinationAccountId: "account-1",
    amount: 120.50,
    date: new Date("2023-05-12T09:15:00"),
    status: "completed",
    description: "Reembolso de compras"
  },
  {
    id: "tx-3",
    sourceAccountId: "account-1",
    destinationAccountId: "account-2",
    amount: 50.00,
    date: new Date("2023-05-15T18:45:00"),
    status: "completed",
    description: "Divisão de conta de restaurante"
  }
];
