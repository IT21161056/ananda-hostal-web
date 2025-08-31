import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL_LOCAL } from "../utils/constants";
import { useAuth } from "./AuthContext";

export interface Notification {
  _id?: string;
  title: string;
  message: string;
  type: "info" | "warning" | "alert";
  createdAt?: string;
  read?: boolean;
}

interface SocketContextType {
  socket: Socket | undefined;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
  markNotificationAsRead: (index: number) => void;
  isConnected: boolean;
  connectionError: string | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | undefined>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const { user, token, isAuthenticated } = useAuth();

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markNotificationAsRead = (index: number) => {
    setNotifications((prev) =>
      prev.map((notif, i) => (i === index ? { ...notif, read: true } : notif))
    );
  };

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(undefined);
      }
      setIsConnected(false);
      setConnectionError(null);
      return;
    }

    console.log(
      "Connecting socket with token:",
      token.substring(0, 20) + "..."
    );

    const newSocket = io(SOCKET_URL_LOCAL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: { token },
      query: { token },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setIsConnected(true);
      setConnectionError(null);

      if (user?.id) {
        newSocket.emit("authenticate", { userId: user.id });
      }
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
      setConnectionError(reason);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      setIsConnected(false);
      setConnectionError(error.message);
    });

    // Listen for authentication success/failure
    newSocket.on("authentication_success", (data) => {
      console.log("Authentication successful:", data);
      setConnectionError(null);
    });

    // Handle backend-side token expiration
    newSocket.on("authentication_failure", (error) => {
      console.error("Socket authentication failed:", error);
      setConnectionError(error.message || "Authentication failed");
    });

    newSocket.on("notification", (notification: Notification) => {
      console.log("Received notification:", notification);
      addNotification(notification);

      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/notification-icon.png",
        });
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setIsConnected(false);
      setConnectionError(null);
    };
    // 🔹 Whenever token changes, re-init the socket automatically
  }, [isAuthenticated, token, user?.id]);

  // Request browser notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, []);

  const value: SocketContextType = {
    socket,
    notifications,
    addNotification,
    clearNotifications,
    markNotificationAsRead,
    isConnected,
    connectionError,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
