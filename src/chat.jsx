import { useState } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = YOUR_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-pro"});

export const metadata = {
  title: "Your Very Own Chatbot!",
  description: "GDSC IIT Indore",
};

export default function Chatbot(props) {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello! How may I help you?",
      sender: "GDSC Bot",
      direction: "incoming"
    }
  ]);



  async function handleSend(message){
    const newMessage = {
      message: message,
      sender: "User",
      direction: "outgoing"
    }

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    setTyping(true);

    try{
      await getQuery(message, newMessages);
    }
    catch(err){
      const errMessage = {
        message: "We are unable to assist with that query.",
        sender: "GDSC Bot",
        direction: "incoming"
      }
  
      const errMessages = [...newMessages, errMessage];
      setMessages(errMessages);
    }

    setTyping(false);
  };



  async function getQuery(chatMessages, newMs){
    const message = await model.generateContent(chatMessages);
  
    const newMessage = {
      message: (message.response).text(),
      sender: "GDSC Bot",
      direction: "incoming"
    }

    const newMessages = [...newMs, newMessage];
    setMessages(newMessages);
  }



  return (
      <div className = 'relative h-[60vh] w-[25vw]'>
        <span className='text-lg'>Hello {props.name}!</span>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior='smooth'
              typingIndicator = {typing ? <TypingIndicator content = "Hold on..."/> : null}
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />
              })}
            </MessageList>
            {!typing ? <MessageInput placeholder='Enter your query: ' onSend={handleSend} />  : null}
          </ChatContainer>
        </MainContainer>
      </div>
  )
}