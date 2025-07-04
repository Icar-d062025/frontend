export interface User {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  banni?: boolean | null;
  banReason?: string;
  banDuration?: number;
}

