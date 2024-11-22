import { create } from 'zustand';
import { WebSocketService } from './websocketService';

interface WebSocketStore {
    service: WebSocketService | null;
    isConnecting: boolean;
    setService: (service: WebSocketService | null) => void;
    setIsConnecting: (isConnecting: boolean) => void;
    connect: (token: string, uuid: string) => Promise<void>;
    disconnect: () => void;
}

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
    service: null,
    isConnecting: false,

    setService: (service) => set({ service }),

    setIsConnecting: (isConnecting) => set({ isConnecting }),

    connect: async (token: string, uuid: string) => {
        const { service, isConnecting } = get();
        if (service && !isConnecting) {
            set({ isConnecting: true });
            try {
                await service.connect();
                set({ isConnecting: false });
            } catch (error) {
                console.error('Failed to connect WebSocket:', error);
                set({ isConnecting: false });
            }
        } else if (!service) {
            const newService = WebSocketService.getInstance();
            set({ service: newService, isConnecting: true });
            newService.initialize(token, uuid);
            try {
                await newService.connect();
                set({ isConnecting: false });
            } catch (error) {
                console.error('Failed to connect WebSocket:', error);
                set({ isConnecting: false, service: null });
            }
        }
    },

    disconnect: () => {
        const { service } = get();
        if (service) {
            service.disconnect();
            WebSocketService.resetInstance();
        }
        set({ service: null, isConnecting: false });
    }
}));