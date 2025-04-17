export type Session = {
  id: string;
  userId: string;
  expiresAt: Date;
  // fresh: boolean;
}

export type User = {
  id: string;
  username: string;
  hashed_password: string;
}
