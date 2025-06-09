import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const createWebSocketClient = (token: string) => {
  return new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/connect'),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    reconnectDelay: 5000,
  });
};
