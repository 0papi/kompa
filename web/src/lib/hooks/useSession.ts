
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

export function useSession() {
  const [user, loading, error] = useAuthState(auth);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
  };
}
