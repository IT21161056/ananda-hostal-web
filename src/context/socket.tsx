import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = Socket | undefined;

const SocketContext = createContext<SocketContextType>(undefined);

export function useSocket(): SocketContextType {
  return useContext(SocketContext);
}

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<SocketContextType>();

  useEffect(() => {
    // const socketUrl =
    //   import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";
    const socketUrl = "https://ananda-hostal-api-4bd6e03768d8.herokuapp.com";

    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
