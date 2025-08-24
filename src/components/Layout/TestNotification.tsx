import React, { useState } from 'react';
import { useSocket } from '../../context/socket';
import Button from '../elements/button/Button';
import axiosInstance from '../../lib/axiosInstance';

const TestNotification: React.FC = () => {
  const { addNotification } = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');

  // Test backend connectivity
  const testBackendConnection = async () => {
    try {
      await axiosInstance.get('/');
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('disconnected');
    }
  };

  // Test backend connection on component mount
  React.useEffect(() => {
    testBackendConnection();
  }, []);

  const sendTestNotification = async (type: string, title: string, message: string) => {
    setIsLoading(true);
    try {
      console.log('Sending test notification...', { type, title, message });
      
      const response = await axiosInstance.post('/test/notification', {
        title,
        message,
        type,
      });

      console.log('Test notification sent successfully', response.data);
      setBackendStatus('connected');
    } catch (error: any) {
      console.error('Error sending test notification:', error);
      
      // Check if it's a cancelation error
      if (error.code === 'ERR_CANCELED' || error.message?.includes('canceled')) {
        console.log('Request was canceled - this is normal in development mode');
        return;
      }
      
      // Fallback to local notification if API fails
      addNotification({
        title,
        message,
        type: type as "info" | "warning" | "alert",
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testNotification = () => {
    sendTestNotification(
      "info",
      "Test Notification",
      "This is a test notification to verify the system is working!"
    );
  };

  const testWarningNotification = () => {
    sendTestNotification(
      "warning",
      "Warning Notification",
      "This is a warning notification!"
    );
  };

  const testAlertNotification = () => {
    sendTestNotification(
      "alert",
      "Alert Notification",
      "This is an alert notification!"
    );
  };

  return (
    <div className="space-y-2">
      {/* Backend Status Indicator */}
      <div className="text-sm">
        <span className="font-medium">Backend Status: </span>
        <span className={`${
          backendStatus === 'connected' ? 'text-green-600' : 
          backendStatus === 'disconnected' ? 'text-red-600' : 
          'text-yellow-600'
        }`}>
          {backendStatus === 'connected' ? '✅ Connected' : 
           backendStatus === 'disconnected' ? '❌ Disconnected' : 
           '⏳ Checking...'}
        </span>
      </div>
      
      {/* Test Buttons */}
      <div className="flex gap-2">
        <Button onClick={testNotification} variant="secondary" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Test Info'}
        </Button>
        <Button onClick={testWarningNotification} variant="secondary" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Test Warning'}
        </Button>
        <Button onClick={testAlertNotification} variant="secondary" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Test Alert'}
        </Button>
      </div>
    </div>
  );
};

export default TestNotification;
