import { useEffect, useRef, useCallback } from 'react';
import { useWebSocketStore } from './websocketStore';
import { useAuthStore } from '@stores/auth';

export const useSocket = () => {
  const { connect, disconnect, service } = useWebSocketStore();
  const token = useAuthStore(state => state.tokens.accessToken) ?? '';
  const uuid = useAuthStore(state => state.uuid);
  const isLogged = useAuthStore(state => state.isLogged);

  const prevIsLoggedRef = useRef(isLogged);

  useEffect(() => {
    console.log('Connecting WebSocket');
    if (isLogged && token && uuid) {
      if (!service) {
        console.log('User logged out, disconnecting WebSocket');
        connect(token, uuid);
      }
    } else {
      if (prevIsLoggedRef.current && !isLogged) {
        console.log('Component unmounting, disconnecting WebSocket');
        disconnect();
      }
    }

    prevIsLoggedRef.current = isLogged;

    return () => {
      if (!isLogged && service) {
        disconnect();
      }
    };
  }, [isLogged, token, uuid, connect, disconnect, service]);

  const subscribeToCommunity = useCallback((communityId: string) => {
    if (service) {
      service.subscribeToCommunity({ communityId });
    } else {
      console.error('WebSocket service not initialized');
    }
  }, [service]);

  const unsubscribeFromCommunity = useCallback((communityId: string) => {
    if (service) {
      service.unsubscribeFromCommunity({ communityId });
    } else {
      console.error('WebSocket service not initialized');
    }
  }, [service]);

  return { 
    subscribeToCommunity, 
    unsubscribeFromCommunity,
    isConnected: !!service && service.isConnected()
  };
};