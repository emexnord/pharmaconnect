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
import { PharmacyService } from '../pharmacy/pharmacy.service';
import { MedicineRequestDocument } from '../medicine-request/entities/medicine-request.entity';
import { MedicineResponseDocument } from '../medicine-response/entities/medicine-response.entity';

@WebSocketGateway()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketGateway.name);
  constructor(
    private readonly socketService: SocketService,
    private readonly pharmacyService: PharmacyService,
  ) {}

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

  @SubscribeMessage('register_pharmacy')
  handlePharmacyRegistration(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    const parsedData: { pharmacyId: string } = JSON.parse(data);

    this.socketService.registerSocket(parsedData.pharmacyId, client.id);
    this.logger.log(
      `Pharmacy ${parsedData.pharmacyId} registered with socket ${client.id}`,
    );
  }

  async broadcastRequestToNearby(createdRequest: MedicineRequestDocument) {
    const socketIds = await this.socketService.getNearbySocketIds(
      createdRequest.pharmacy.toString(),
    );

    // emit event to each socket
    socketIds.forEach((socketId) => {
      this.server.to(socketId).emit('new-medicine-request', createdRequest);
    });

    this.logger.log(
      `Broadcasted request "${createdRequest.medicineName}" to ${socketIds.length} nearby pharmacies.`,
    );
  }

  async notifyPharmacyAboutNewResponse(
    createdResponse: MedicineResponseDocument,
    ownerPharmacyId: string,
  ) {
    const socketId = this.socketService.getSocketId(ownerPharmacyId);
    if (socketId) {
      this.server.to(socketId).emit('new-medicine-response', createdResponse);
      this.logger.log(
        `Notified pharmacy ${ownerPharmacyId} about new response to their request.`,
      );
    } else {
      this.logger.warn(
        `Could not notify pharmacy ${ownerPharmacyId}: no active socket connection.`,
      );
    }
  }
}
