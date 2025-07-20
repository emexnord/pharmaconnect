import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketGateway.name);
  constructor(private readonly SocketService: SocketService) {}

  @WebSocketServer() server: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('args', args);
    const { sockets } = this.server.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client id:${client.id} disconnected`);
  }

  @SubscribeMessage('ping')
  handleMessage(client: Socket, data: any) {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);
    return {
      event: 'ping',
      data: 'Wrong data that will make the test fail',
    };
  }

  @SubscribeMessage('register_pharmacy')
  handlePharmacyRegistration(
    @MessageBody()
    data: string,
    @ConnectedSocket() client: Socket,
  ) {
    const parsedData: {
      pharmacyId: string;
      latitude: number;
      longitude: number;
    } = JSON.parse(data);

    this.SocketService.registerSocket(
      parsedData.pharmacyId,
      client.id,
      parsedData.latitude,
      parsedData.longitude,
    );
    console.log(`Pharmacy ${parsedData.pharmacyId} registered at ${client.id}`);
  }

  broadcastRequestToNearby(request: {
    medicineName: string;
    latitude: number;
    longitude: number;
    pharmacyId: string;
  }) {
    const nearbySockets = this.SocketService.findNearbySockets(
      request.latitude,
      request.longitude,
      5, // radius in km
    );

    nearbySockets.forEach((socketId) => {
      this.server.to(socketId).emit('new-medicine-request', request);
    });
  }
}
