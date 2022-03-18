import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function RequireAuth({children}) {
    var auth = useContext(AuthContext);
    useEffect(() => {
        const checkAuth = async () => {
            if (!auth.authed) {
                await auth.isAuthed();
            }
        }
        checkAuth();
    }, [])
    if (!auth.authed) {
        return <Navigate to="/login" replace />
      } else {
        return children;
      }
}

export default RequireAuth;