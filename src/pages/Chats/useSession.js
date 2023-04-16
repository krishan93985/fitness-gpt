import { useState, useEffect } from "react";
import { getSessionById, createSession } from "./apis";

export const useSession = (sessionId) => {
    const [session, setSession] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    //get session
    const onGetSessionSuccessHandler = async (data) => {
        console.log("Session Data Fetched",{data});
        setSession(data);
        setLoading(false);
    }

    const onGetSessionFailureHandler = async (error) => {
        console.log("Failed to fetch session : ",{error})
        setError(error)
        setLoading(false);
    }
    
    const getSessionByIdHandler = async (sessionId) => {
        await getSessionById({sessionId, onSuccess:onGetSessionSuccessHandler, onFailure:onGetSessionFailureHandler})
    }
    
    //create Session
    const onCreateSessionSuccessHandler = async (data) => {
        console.log("Session Data Fetched",{data});
        if(data?.user_id) window.localStorage.setItem("sessionId",JSON.stringify(data?.user_id));
        setSession({ id:data.user_id, data:[] });
        setLoading(false);
    }
    
    const onCreateSessionFailureHandler = async (error) => {
        console.log("Failed to fetch session : ",{error})
        setError(error);
        setLoading(false);
    }

    const createSessionHandler = async () => {
        await createSession({onSuccess:onCreateSessionSuccessHandler, onFailure:onCreateSessionFailureHandler});
    }

    useEffect(() => {
        if(sessionId && sessionId !== "undefined" && sessionId !== "null"){
            getSessionByIdHandler(sessionId)
        } else {
            createSessionHandler()
        }
    },[])

    return { session, error, loading }
}