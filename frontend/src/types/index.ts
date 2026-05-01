export interface User {
    uid: string;
    username: string;
    email: string;
    balance: number;
    phone: string;
    role: 'Customer' | 'Manager' | 'Admin';
    createdAt: string;
    updatedAt: string;
}

export interface Transaction {
    _id: string;
    userId: string;
    type: 'credit' | 'debit' | 'transfer';
    amount: number;
    description: string;
    recipientAccountNumber?: string;
    createdAt: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        accessToken: string;
    };
}
