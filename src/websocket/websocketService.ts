import { useActivityStore } from "@stores/activityStore";
import { usePostStore } from "@stores/channelPost";

const SOCKET_URL = "wss://6xtnljiymk.execute-api.eu-west-3.amazonaws.com/v1/";
const PING_INTERVAL = 30000; // 30 seconds
const MAX_RETRIES = 5;
const MAX_ERRORS_BEFORE_REFRESH = 6;

interface CommunityData {
    communityId: string;
}

export class WebSocketService {
    private static instance: WebSocketService | null = null;
    private socket: WebSocket | null = null;
    private reconnectAttempts = 0;
    private pingInterval: NodeJS.Timeout | null = null;
    private actionQueue: any[] = [];
    private token: string = '';
    private uuid: string = '';
    private isConnecting: boolean = false;
    private errorCount: number = 0;

    private constructor() { }

    static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    static resetInstance(): void {
        if (WebSocketService.instance) {
            WebSocketService.instance.disconnect();
            WebSocketService.instance = null;
        }
    }

    initialize(token: string, uuid: string): void {
        this.token = token;
        this.uuid = uuid;
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.socket?.readyState === WebSocket.OPEN) {
                resolve();
                return;
            }
            if (this.isConnecting) {
                this.waitForConnection().then(resolve).catch(reject);
                return;
            }

            this.isConnecting = true;
            console.log(this.token);
            this.socket = new WebSocket(`${SOCKET_URL}?token=${this.token}`);
            this.socket.onopen = () => {
                console.log('WebSocket connected');
                this.isConnecting = false;
                this.reconnectAttempts = 0;
                this.startPingInterval();
                this.flushQueue();
                resolve();
            };

            this.socket.onmessage = this.handleMessage.bind(this);
            this.socket.onclose = this.handleClose.bind(this);
            this.socket.onerror = this.handleError.bind(this);
        });
    }

    private handleError(error: Event): void {
        console.error('WebSocket error:', error);
        this.errorCount++;

        if (this.errorCount >= MAX_ERRORS_BEFORE_REFRESH) {
            console.log('Max error count reached. Refreshing the page...');
            window.location.reload();
        } else {
            this.isConnecting = false;
        }
    }

    private waitForConnection(): Promise<void> {
        return new Promise((resolve) => {
            const checkConnection = () => {
                if (this.socket?.readyState === WebSocket.OPEN) {
                    resolve();
                } else {
                    setTimeout(checkConnection, 100);
                }
            };
            checkConnection();
        });
    }

    private handleMessage(event: MessageEvent): void {
        const data: any = JSON.parse(event.data);
        const { addPost, addComment, addReaction, deleteReaction, addUpdatePost } = usePostStore.getState();

        switch (data.messageType) {
            case 'feedChannelMessage':
                addPost(data);
                break;
            case 'commentPostMessage':
                addComment(data);
                break;
            case 'feedChannelReaction':
                addReaction(data, this.uuid);
                break;
            case 'deletefeedChannelReaction':
                deleteReaction(data, this.uuid);
                break;
            case 'updateFeedChannelMessage':
                addUpdatePost(data.channelId, data.id, data.content);
                break;
            case 'pong':
                break;
            default:
        }
    }

    private handleClose(): void {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        this.stopPingInterval();
        this.reconnect();
    }

    private reconnect(): void {
        if (this.reconnectAttempts >= MAX_RETRIES) {
            console.error('Max reconnection attempts reached');
            return;
        }

        const delay = Math.pow(2, this.reconnectAttempts) * 1000;
        this.reconnectAttempts++;

        setTimeout(() => this.connect(), delay);
    }

    private startPingInterval(): void {
        this.pingInterval = setInterval(() => {
            const { getTemporaryActivities, clearTemporaryActivities } = useActivityStore.getState();
            const activities = getTemporaryActivities();

            this.sendOrEnqueue({
                action: 'ping',
                activities: activities
            });

            clearTemporaryActivities();
        }, PING_INTERVAL);
    }

    private stopPingInterval(): void {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }
    }

    private async sendOrEnqueue(action: any): Promise<void> {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(action));
        } else {
            this.actionQueue.push(action);
            await this.connect();
        }
    }

    private async flushQueue(): Promise<void> {
        while (this.actionQueue.length > 0) {
            const action = this.actionQueue.shift();
            if (action) {
                if (action.type === "request") {
                    if (action.action === "openCommunity") {
                        await this.subscribeToCommunity({ communityId: action.communityId });
                    } else if (action.action === "unsubscribeCommunity") {
                        await this.unsubscribeFromCommunity({ communityId: action.communityId });
                    }
                } else {
                    await this.sendOrEnqueue(action);
                }
            }
        }
    }

    async subscribeToCommunity({ communityId }: CommunityData): Promise<void> {
        await this.sendOrEnqueue({
            action: 'subscribecommunity',
            communityId,
            at: Date.now()
        });
    }

    async unsubscribeFromCommunity({ communityId }: CommunityData): Promise<void> {
        await this.sendOrEnqueue({
            action: 'unsubscribecommunity',
            communityId,
            at: Date.now()
        });
    }

    isConnected(): boolean {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    }


    disconnect(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.stopPingInterval();
        this.isConnecting = false;
    }
}