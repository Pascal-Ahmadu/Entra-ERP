export interface Account {
    id: number;
    code: string;
    name: string;
    type: string;
    subType: string | null;
    category: string | null;
    balance: number;
}
