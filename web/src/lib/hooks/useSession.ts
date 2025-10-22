import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { type User } from "firebase/auth";

interface CustomClaims {
  role?: "PROVIDER" | "CONSUMER" | "CONSUMER_PROVIDER";

}

export function useSession() {
  const [user, authLoading, authError] = useAuthState(auth);
  const [claims, setClaims] = useState<CustomClaims>({});
  const [claimsLoading, setClaimsLoading] = useState(true); // Separate loading state for claims

  useEffect(() => {
   
    if (!user) {
      
      setClaims({});
      setClaimsLoading(false);
      return;
    }

    
    (async () => {
      try {
        // Force refresh to get the latest claims, crucial after login or updates.
        const idTokenResult = await user.getIdTokenResult(true);
        const role = idTokenResult?.claims?.role;
        console.log('idtokenresult', idTokenResult)
        setClaims((prev) => ({...prev, role: role as any}));
      } catch (error) {
        console.error("Error fetching custom claims:", error);
     
      } finally {
    
        setClaimsLoading(false);
      }
    })();
  }, [user]); 

  return {
    user: user as User | null,
    role: claims.role,
    claims: claims,    
    loading: authLoading || claimsLoading, 
    error: authError,
    isAuthenticated: !!user && !authLoading,
  };
}
