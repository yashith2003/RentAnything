//RentAnything/utils/socket.service.ts

import { io, Socket } from 'socket.io-client';
import { Config } from '@/constants/config';
import * as SecureStore from 'expo-secure-store';

class SocketService {
  private socket: Socket | null = null;
  private connectingPromise: Promise<void> | null = null;

  async connect(): Promise<void> {
    if (this.socket?.connected) return;
    if (this.connectingPromise) return this.connectingPromise;

    this.connectingPromise = new Promise(async (resolve, reject) => {
      try {
        const serverUrl = Config.BASE_URL;
        const token = await SecureStore.getItemAsync('access_token');
        console.log(`[SocketService] Connecting to ${serverUrl}...`);

        this.socket = io(serverUrl, {
          transports: ['polling', 'websocket'],
          auth: { token },
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
          console.log(`[SocketService] Connected: ${this.socket?.id}`);
          this.connectingPromise = null;
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          console.log('[SocketService] Disconnected:', reason);
          this.connectingPromise = null; // Clear promise if disconnected while connecting
        });

        this.socket.on('connect_error', (error) => {
          console.error('[SocketService] Connection Error:', error.message);
          this.connectingPromise = null;
          reject(error);
        });

      } catch (error) {
        this.connectingPromise = null;
        reject(error);
      }
    });

    return this.connectingPromise;
  }

  async joinRoom(threadId: number) {
    if (!this.socket?.connected) await this.connect();
    console.log(`[SocketService] Joining room: thread_${threadId}`);
    this.socket?.emit('joinRoom', threadId.toString());
  }

  async leaveRoom(threadId: number) {
    if (!this.socket) return;
    console.log(`[SocketService] Leaving room: thread_${threadId}`);
    this.socket?.emit('leaveRoom', threadId.toString());
  }

  async sendMessage(data: { threadId: number; content: string }) {
    if (!this.socket?.connected) await this.connect();
    console.log(`[SocketService] Sending message to thread ${data.threadId}`);
    this.socket?.emit('sendMessage', data);
  }

  onNewMessage(callback: (message: any) => void) {
    if (!this.socket?.connected) this.connect(); // No await needed, just trigger
    this.socket?.on('newMessage', callback);
  }

  async checkStatus(userId: number): Promise<'online' | 'offline'> {
    if (!this.socket?.connected) await this.connect();
    return new Promise((resolve) => {
      this.socket?.emit('checkStatus', userId, (response: { status: 'online' | 'offline' }) => {
        resolve(response.status);
      });
      // Fallback for safety
      setTimeout(() => resolve('offline'), 2000);
    });
  }

  onUserStatus(callback: (data: { userId: number; status: 'online' | 'offline' }) => void) {
    this.socket?.on('userStatus', callback);
  }

  offUserStatus() {
    this.socket?.off('userStatus');
  }

  offNewMessage() {
    this.socket?.off('newMessage');
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
