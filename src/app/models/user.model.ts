export interface User {
  id: number;
  username: string;
  email?: string;
  prenom?: string;    // Changé de firstName vers prenom
  nom?: string;       // Changé de lastName vers nom
  role?: string;
  banni?: boolean | null;
  banReason?: string;
  banDuration?: number;
}
