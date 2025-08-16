import React, { useState, useEffect, useRef, FormEvent } from "react";
import { Send, Users, Wifi, WifiOff } from "lucide-react";
import { useSocket } from "../context/socket";

type Message = {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  type?: "system" | "user";
  isOwn?: boolean;
};

type UserEventData = {
  username: string;
  userCount: number;
};

const Chat = () => {
  const socket = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [usernameSet, setUsernameSet] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !usernameSet) return;

    const handleChatMessage = (data: Omit<Message, "id">) => {
      const isOwn = data.username === username;
      setMessages((prev) => [
        ...prev,
        { ...data, id: Date.now().toString(), isOwn },
      ]);
    };

    const handleCurrentUsers = (data: {
      users: string[];
      userCount: number;
    }) => {
      setOnlineUsers(data.userCount);
    };

    const handleUserJoined = (data: UserEventData) => {
      setOnlineUsers(data.userCount);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          username: "System",
          message: `${data.username} joined the chat`,
          timestamp: new Date().toISOString(),
          type: "system",
        },
      ]);
    };

    const handleUserLeft = (data: UserEventData) => {
      setOnlineUsers(data.userCount);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          username: "System",
          message: `${data.username} left the chat`,
          timestamp: new Date().toISOString(),
          type: "system",
        },
      ]);
    };

    // Set up all event listeners
    socket.on("chat_message", handleChatMessage);
    socket.on("current_users", handleCurrentUsers);
    socket.on("user_joined", handleUserJoined);
    socket.on("user_left", handleUserLeft);

    // Join the chat with username
    socket.emit("join_chat", { username });

    return () => {
      // Clean up all event listeners
      socket.off("chat_message", handleChatMessage);
      socket.off("current_users", handleCurrentUsers);
      socket.off("user_joined", handleUserJoined);
      socket.off("user_left", handleUserLeft);

      // Notify server about leaving (optional)
      socket.emit("leave_chat", { username });
    };
  }, [socket, usernameSet, username]);

  const handleUsernameSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setUsernameSet(true);
    }
  };

  const handleMessageSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socket?.connected) {
      const messageData = {
        username,
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
      };

      // Optimistic UI update
      setMessages((prev) => [
        ...prev,
        {
          ...messageData,
          id: Date.now().toString(),
          isOwn: true,
        },
      ]);

      socket.emit("chat_message", messageData);
      setNewMessage("");
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!usernameSet) {
    return (
      <div className=" flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Join Chat</h1>
            <p className="text-gray-600">
              Enter your username to start chatting
            </p>
          </div>

          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                maxLength={20}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-200"
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto max-w-4xl flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-b-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Chat Room</h1>
                <p className="text-sm text-gray-500">Welcome, {username}!</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">{onlineUsers} online</span>
              </div>
              <div className="flex items-center space-x-2">
                {socket?.connected ? (
                  <Wifi className="w-5 h-5 text-green-500" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ${
                    socket?.connected ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {socket?.connected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden flex flex-col p-4">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      msg.type === "system"
                        ? "bg-gray-200 text-gray-600 text-center mx-auto text-sm"
                        : msg.isOwn
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800 shadow-md"
                    }`}
                  >
                    {msg.type !== "system" && !msg.isOwn && (
                      <p className="text-xs font-semibold mb-1 opacity-70">
                        {msg.username}
                      </p>
                    )}
                    <p className="break-words">{msg.message}</p>
                    {msg.type !== "system" && (
                      <p
                        className={`text-xs mt-1 ${
                          msg.isOwn ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4">
          <form onSubmit={handleMessageSubmit} className="flex space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={
                  socket?.connected ? "Type your message..." : "Connecting..."
                }
                disabled={!socket?.connected}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100"
                maxLength={500}
              />
            </div>
            <button
              type="submit"
              disabled={!socket?.connected || !newMessage.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 flex items-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
