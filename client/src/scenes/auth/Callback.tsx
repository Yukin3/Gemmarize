import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Callback() {
  const { isLoading, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !error) {
      navigate("/"); // Redirect anywhere after login
    }
  }, [isLoading, error, navigate]);

  if (error) return <p className="text-destructive">Error: {error.message}</p>;

  return <p className="text-muted-foreground text-center mt-12">Finalizing login...</p>;
}
