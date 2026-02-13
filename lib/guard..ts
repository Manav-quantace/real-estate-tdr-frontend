import { useAuth } from "./auth-context";

export function useRequireRole(roles: string[]) {
  const { user } = useAuth();

  if (!user) return false;
  return roles.includes(user.role);
}