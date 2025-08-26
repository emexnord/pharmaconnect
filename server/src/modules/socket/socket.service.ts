import { Injectable } from '@nestjs/common';
import { PharmacyService } from '../pharmacy/pharmacy.service';

@Injectable()
export class SocketService {
  private connections: Map<string, string> = new Map();
  // pharmacyId -> socketId

  constructor(private readonly pharmacyService: PharmacyService) {}

  registerSocket(pharmacyId: string, socketId: string) {
    this.connections.set(pharmacyId, socketId);
  }

  removeSocket(socketId: string) {
    for (const [pharmacyId, id] of this.connections.entries()) {
      if (id === socketId) {
        this.connections.delete(pharmacyId);
        break;
      }
    }
  }

  getSocketId(pharmacyId: string): string | undefined {
    return this.connections.get(pharmacyId);
  }

  async getNearbySocketIds(pharmacyId: string): Promise<string[]> {
    const nearbyPharmacyIds =
      await this.pharmacyService.getNearbyPharmaciesToNotify(pharmacyId);

    return nearbyPharmacyIds
      .map((id) => this.getSocketId(id))
      .filter((socketId): socketId is string => !!socketId);
  }

  getSocketIds(pharmacyIds: string[]): string[] {
    return pharmacyIds
      .map((id) => this.connections.get(id))
      .filter((socketId): socketId is string => !!socketId);
  }
}
