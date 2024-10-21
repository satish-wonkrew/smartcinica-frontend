import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/"); // Redirect to login if not authenticated
    }
  }, [user, router]);

  return user ? children : null; // Render children if authenticated
};

export default ProtectedRoute;
