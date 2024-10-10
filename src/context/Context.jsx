import { createContext, useState } from "react";
import run from "../config/Gemini";

// Create a context
export const Context = createContext();

// Context provider component
const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [RecentPrompt, setRecentPrompt] = useState("");
  const [PrevPrompt, setPrevPrompt] = useState([]);
  const [ShowResult, setShowResult] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [ResultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
        setResultData(prev => prev+nextWord);
    }, 75*index);
  };

  const newChat = () => {
    setLoading(false)
    setShowResult(false)
  }

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if(prompt !== undefined){
        response = await run(prompt);
        setRecentPrompt(prompt)
    }
    else{
        setPrevPrompt(prev => [...prev,input])
        setRecentPrompt(input)
        response = await run(input)
    }
    
    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newResponse2 = newResponse.split("*").join("</br>");
    let newResponseArray = newResponse2.split(" ");
    for(let i=0;i<newResponseArray.length;i++){
        const nextWord = newResponseArray[i];
        delayPara(i,nextWord+" ")
    }
    setLoading(false);
    setInput("");
  };

  const contextValue = {
    PrevPrompt,
    setPrevPrompt,
    onSent,
    setRecentPrompt,
    RecentPrompt,
    ShowResult,
    Loading,
    ResultData,
    setResultData,
    input,
    setInput,
    newChat
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
