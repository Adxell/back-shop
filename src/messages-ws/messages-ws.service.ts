import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io'

interface ConnectedClients {
    [id: string]: Socket
}

@Injectable()
export class MessagesWsService {
    private connectClients: ConnectedClients = {}

    registerClient(client: Socket) {
        this.connectClients[client.id] = client
    }

    removeClient ( clientId: string) {
        delete this.connectClients[clientId]
    }

    getConnectClients(): string[] {
        return Object.keys(this.connectClients)
    }
}
