export interface AuthProvider {
  createAccount(userId: string, userEmail: string): Promise<void>
}
