import React, { useEffect, useState } from 'react'
import "./SelfWriteText.css";

export default function SelfWriteText({ text, setInputDisabled, setScrollIntoViewTrigger }) {
  const [displayText, setDisplayText] = useState("");
      
  useEffect(() => {
      const textToWrite = text;
      let currentIndex = 0;
      const intervalId = setInterval(() => {
          if (currentIndex >= textToWrite.length) {
            clearInterval(intervalId);
            setInputDisabled && setInputDisabled(false);
          } else {
            setDisplayText(textToWrite.slice(0, currentIndex + 1));
            currentIndex++;
          }
          setScrollIntoViewTrigger && setScrollIntoViewTrigger(prev => !prev);
      }, 18);
      return () => clearInterval(intervalId);
  }, [text, 18]);     

  return (
    <div className='self-writing-text message-text'>{displayText}{<span id="caret">&nbsp;</span>}</div>
  )
}
