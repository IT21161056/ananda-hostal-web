import useGetRequest from "../hooks/useGetRequest";
import usePostRequest from "../hooks/usePostRequest";
import usePutRequest from "../hooks/usePutRequest";


export interface Notification {
  _id: string;
  user: string;
  type: "info" | "warning" | "alert";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationRequest {
  user: string;
  title: string;
  message: string;
  type?: "info" | "warning" | "alert";
}

// Get all notifications for the current user
export const useGetNotifications = () => {
  return useGetRequest<Notification[]>("/notification");
};

// Get notifications for a specific user
export const useGetUserNotifications = (userId: string) => {
  return useGetRequest<Notification[]>(`/notification/${userId}`);
};

// Mark notification as read
export const useMarkNotificationAsRead = () => {
  return usePutRequest<Notification>("/notification");
};

// Create notification (admin/system action)
export const useCreateNotification = () => {
  return usePostRequest<Notification, CreateNotificationRequest>("/notification");
};

// API functions for direct use
export const getNotifications = async (): Promise<Notification[]> => {
  const response = await fetch("/api/v1/notification", {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch notifications");
  return response.json();
};

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  const response = await fetch(`/api/v1/notification/${userId}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch user notifications");
  return response.json();
};

export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  const response = await fetch(`/api/v1/notification/${notificationId}/read`, {
    method: "PUT",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to mark notification as read");
  return response.json();
};

export const createNotification = async (data: CreateNotificationRequest): Promise<Notification> => {
  const response = await fetch("/api/v1/notification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create notification");
  return response.json();
};


