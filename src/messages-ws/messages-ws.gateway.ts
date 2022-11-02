import { JwtService } from '@nestjs/jwt';
import { WebSocketGateway, OnGatewayConnection, SubscribeMessage, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';

import { Socket, Server } from 'socket.io'
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { NewMessajeDto } from './dtos/new-message.dto';

import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
 
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService, 
    private readonly jwtService: JwtService
  ) {}
  async handleConnection(client:  Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token)
       await this.messagesWsService.registerClient( client, payload.id)
    } catch (error) {
      client.disconnect()
      return
    }

    // console.log({payload})

    this.wss.emit('clients-updated', this.messagesWsService.getConnectClients())
    
  }
  handleDisconnect(client: Socket ) {
    this.messagesWsService.removeClient( client.id )    
    this.wss.emit('clients-updated', this.messagesWsService.getConnectClients())
  }
  @SubscribeMessage('message-from-client')
  handleMessageFromClient( client: Socket, payload: NewMessajeDto ) {
    //Emite unicamente al cliente, 
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo', 
    //   message: payload.message || ''
    // })

    //Emitir a todos Menos, al cliente
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo', 
    //   message: payload.message || ''
    // })

    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserfullNameBySocket(client.id), 
      message: payload.message || ''
    })

  }
}
