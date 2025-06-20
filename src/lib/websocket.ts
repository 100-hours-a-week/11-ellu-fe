import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const createWebSocketClient = (token: string) => {
  return new Client({
    webSocketFactory: () => new SockJS(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/connect`),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    reconnectDelay: 5000,
  });
};
