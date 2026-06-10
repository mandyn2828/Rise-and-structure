import axios from 'axios';
import { API_URL } from '../api/config';

const PUBLIC_VAPID_KEY = 'BAhVx7mMQF0acNtFL5VXzWfiuBRozpjAoDkGjwvMg8XFy0TtebMj65BvO50h9wi9bUfD1DfHWlOxroKkTM3NqCk';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeToPush() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
      });

      await axios.post(`${API_URL}/notifications/subscribe`, subscription);
      return true;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return false;
    }
  }
  return false;
}

export async function checkPushSubscription() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  }
  return false;
}
