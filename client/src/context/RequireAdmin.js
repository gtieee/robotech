import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function RequireAdmin({children}) {
    var auth = useContext(AuthContext);
    useEffect(() => {
        const checkAdmin = async () => {
            if (auth.admin !== 'yes') {
                await auth.isAdmin();   
            }
      }
      checkAdmin();
    }, [])
    if (auth.admin === 'no') {
      return <Navigate to='/home' replace />
    } else {
      return children;
    }
}

export default RequireAdmin;
