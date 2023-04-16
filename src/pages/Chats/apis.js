import { djangoServerBaseUrl } from "../../constants"
import { apiRequest } from "../../utils/api-request"

export const generatePrompt = async ({
    sessionId, role, text, onSuccess, onFailure
}) => {
    const requestOptions = {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            data:{
                role,
                text
            }
        })
    }
    await apiRequest(
        `${djangoServerBaseUrl}/sessions/${sessionId}/prompt/`,
        requestOptions,
        onSuccess,
        onFailure
        )
}

export const getSessionById = async ({
    sessionId, onSuccess, onFailure
}) => {
    const requestOptions = {
        method:"GET",
    }
    await apiRequest(
        `${djangoServerBaseUrl}/sessions/${sessionId}/`,
        requestOptions,
        onSuccess,
        onFailure
        )
}

export const createSession = async ({
    onSuccess, onFailure
}) => {
    const requestOptions = {
        method:"POST"
    }
    await apiRequest(
        `${djangoServerBaseUrl}/sessions/`,
        requestOptions,
        onSuccess,
        onFailure
        )
}