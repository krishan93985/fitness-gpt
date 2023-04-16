import { useEffect, useRef, useState } from "react";
import "./Chats.css";
import { CircularProgress, IconButton, TextField } from "@mui/material"
import SendIcon from '@mui/icons-material/Send';
import ChatMessage from "../../features/chats/components/ChatMessage/ChatMessage";
import { generatePrompt } from "./apis";
import { ChatMemberRole } from "../../constants";
import { useSession } from "./useSession";
import appLogo from "../../assets/images/fitness-gpt-logo.jpg";

export default function Chats() {
    const [userPrompt, setUserPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const lastChatElRef = useRef(null);
    const [inputDisabled, setInputDisabled] = useState(false);
    const [scrollIntoViewTrigger, setScrollIntoViewTrigger] = useState(false);
    const {session, error, loading} = useSession(JSON.parse(window.localStorage.getItem("sessionId")));

    useEffect(() => {
        if(lastChatElRef.current) {
           lastChatElRef.current.scrollIntoView({ behaviour:"smooth", block:"end", inline:"nearest" })
        } 
    },[lastChatElRef.current, inputDisabled, scrollIntoViewTrigger])

    useEffect(() => {
        if(session?.data?.length) setMessages(session.data);
    },[session?.id])

    const onGeneratePromptSuccess = async (data) => {
        console.log({data})
        setMessages((prevMessages) => [...prevMessages, { role:ChatMemberRole["GPT-3"], text:data.response}])
    }
    
    const onGeneratePromptFailure = async (error) => {
        console.log("Error Generating GPT-3 Prompt",{error})
        setInputDisabled(false);
        // setMessages((prevMessages) => [...prevMessages, { role:ChatMemberRole["GPT-3"], text:data.response}])
    }

    const handlePromptSubmitClick = (e) => {
        if(inputDisabled) return;
        const prevUserPrompt = userPrompt;
        setUserPrompt("");

        if(prevUserPrompt?.length > 400) {
            setMessages(prevMessages => [...prevMessages,{role:ChatMemberRole.USER, text:prevUserPrompt},{role:ChatMemberRole["GPT-3"], text:"Please provide your question in a bit concise form. Sorry for the inconvenience but My Free version doesn't support more than 400 words!"}])
            return;
        }

        setInputDisabled(true);
        setMessages(prevMessages => {
            console.log("User Messages",[...prevMessages,{role:ChatMemberRole.USER, text:userPrompt}])
            return [...prevMessages,{role:ChatMemberRole.USER, text:userPrompt}]
        })
        generatePrompt({
            sessionId:session?.id,
            role:ChatMemberRole.USER,
            text:userPrompt,
            onSuccess:onGeneratePromptSuccess,
            onFailure:onGeneratePromptFailure
        })
    }

  return (
    <div className="chats-container">
        {error && <h2>Error With Session Initialization!</h2>}
        {session?.id && !session.data?.length && !messages?.length && !loading &&
            <div className="welcome-container">
                <img alt="app-logo" src={appLogo} style={{width:"8rem", height:"8rem", borderRadius:"50%"}} />
                <p className="message-text" style={{textAlign:"center", paddingTop:"0.5rem"}}>Your AI fitness coach. Chat with our bot for workout routines, nutrition tips and expert advice. Let's get fit together! 🏋️‍♀️💪🥦 #FitBot #ChatGPT #FitnessGoals</p>
            </div>
        }
        {loading && 
            <CircularProgress color="secondary" style={{margin:"auto"}} />
        }
        <div className="chats">
            {messages?.map((message,index) =>
                index === messages?.length -1 ?
                    <ChatMessage key={index} message={message} ref={lastChatElRef} selfWrite={message.role === ChatMemberRole["GPT-3"] && inputDisabled} setInputDisabled={setInputDisabled} setScrollIntoViewTrig={setScrollIntoViewTrigger} />
                    :
                    <ChatMessage key={index} message={message}/>
                )}
        </div>
        <div className="chat-input-wrapper">
            <div className="chat-input">
                <TextField
                    id="chat-input"
                    onKeyDown={(e) => e.key === "Enter" && handlePromptSubmitClick()}
                    label="Send a message..."
                    aria-label="chat input"
                    type="text"
                    variant="filled"
                    value={userPrompt}
                    sx={{ width: "100%" }}
                    disabled={inputDisabled}
                    style={{ margin: "0rem", caretColor:"white" }}
                    inputProps={{ style:{ color:"white" } }}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    hiddenLabel={Boolean(userPrompt)}
                    InputProps={{
                    color:"white",
                    endAdornment:(
                        <IconButton onClick={handlePromptSubmitClick}>
                            <SendIcon style={{color:"gray"}} />
                        </IconButton>
                    )
                    }}
                    InputLabelProps={{
                        shrink: true,
                        style:{ color:"#878787", ...userPrompt && {display:"none"} }
                    }}
                    />
            </div>
        </div>
    </div>
  )
}
