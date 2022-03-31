import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function RequireVolunteer({children}) {
    var auth = useContext(AuthContext);
    useEffect(() => {
        const checkVolunteer = async () => {
            if (!(auth.admin === 'yes' || auth.volunteer === 'yes')) {
                await auth.isVolunteer();   
                await auth.isAdmin();
            }
      }
      checkVolunteer();
    }, [])
    if (auth.admin === 'no' && auth.volunteer === 'no') {
      return <Navigate to='/home' replace />
    } else {
      return children;
    }
}

export default RequireVolunteer;
