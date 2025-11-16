import { Navigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useEffect, useState } from "react";

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    checkSession();
  }, []);

  if (loading) return null; //  reemplazar con un spinner luego 

  return session ? children : <Navigate to="/login" replace />;
}
