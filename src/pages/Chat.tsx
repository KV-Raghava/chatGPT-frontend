import React, { useEffect,
   useLayoutEffect, useRef, useState } from "react";
import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import red from "@mui/material/colors/red";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";
type Message = {
  role: "user" | "assistant";
  content: string;
};
const Chat = () => {
  const static_chats = [
    {"role": "assistant", "content": "Hello! How can I assist you today?"},
    {"role": "user", "content": "Hi there! I need help with setting up my email."},
    {"role": "assistant", "content": "Sure, I can help with that. Which email service are you using?"},
    {"role": "user", "content": "I'm using Gmail."},
    {"role": "assistant", "content": "Great choice! Here's a step-by-step guide to set up your Gmail account."},
    {"role": "assistant", "content": "Step 1: Open the Gmail app or go to the Gmail website."},
    {"role": "assistant", "content": "Step 2: Click on the 'Settings' gear icon in the top right corner."},
    {"role": "assistant", "content": "Step 3: Select 'See all settings' from the dropdown menu."},
    {"role": "assistant", "content": "Step 4: Click on the 'Accounts and Import' tab."},
    {"role": "assistant", "content": "Step 5: In the 'Check mail from other accounts' section, click on 'Add a mail account'."},
    {"role": "assistant", "content": "Step 6: Enter your email address and click 'Next'."},
    {"role": "assistant", "content": "Step 7: Follow the on-screen instructions to complete the setup process."},
    {"role": "user", "content": "Thank you! That was very helpful."},
    {"role": "assistant", "content": "You're welcome! If you have any more questions, feel free to ask."}
]
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);
    const chatData = await sendChatRequest(content);
    setChatMessages([...chatData.chats]);
  };
  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch (error) {
      console.log(error);
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };
  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading Chats", 
      { id: "loadchats" });
      getUserChats()
        .then((data) => {
          setChatMessages([...data.chats]);
          toast.success("Successfully loaded chats", 
          { id: "loadchats" });
        })
        .catch((err) => {
          console.log(err);
          toast.error("Loading Failed", 
          { id: "loadchats" });
        });
    }
  }, [auth]);
  useEffect(() => {
    if (!auth?.user) {
      return navigate("/login");
    }
  }, [auth]);
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          flex: 0.2,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "60vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          >
            {auth?.user?.name[0]}
            {/* {auth?.user?.name.split(" ")[1][0]} */}
          </Avatar>
          <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
            You are talking to a ChatBOT
          </Typography>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 4, p: 3 }}>
            You can ask questions related to Knowledge, Business, Advices,
            Education, etc. But avoid sharing personal information
          </Typography>
          <Button
            onClick={handleDeleteChats}
            sx={{
              width: "200px",
              my: "auto",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover": {
                bgcolor: red.A400,
              },
            }}
          >
            Clear Conversation
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: "column",
          px: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "40px",
            color: "white",
            mb: 2,
            mx: "auto",
            fontWeight: "600",
          }}
        >
          Model - GPT 3.5 Turbo
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            overflowX: "hidden",
            overflowY: "auto",
            scrollBehavior: "smooth",
          }}
        >
          {chatMessages.map((chat, index) => (
            //@ts-ignore
            <ChatItem content={chat.content} role={chat.role} key={index} />
            // <div>{chat.content}</div>
          ))}
          
        </Box>
        <div
          style={{
            width: "100%",
            borderRadius: 8,
            backgroundColor: "rgb(17,27,39)",
            display: "flex",
            margin: "auto",
          }}
        >
          {" "}
          <input
            ref={inputRef}
            type="text"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "30px",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "20px",
            }}
          />
          <IconButton onClick={handleSubmit} sx={{ color: "white", mx: 1 }}>
            <IoMdSend />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;