import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  providers: [SocketService, SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
