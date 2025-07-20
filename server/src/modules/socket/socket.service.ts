import { Injectable } from '@nestjs/common';

interface PharmacySocket {
  socketId: string;
  pharmacyId: string;
  latitude: number;
  longitude: number;
}

@Injectable()
export class SocketService {
  private connections: PharmacySocket[] = [];

  registerSocket(
    pharmacyId: string,
    socketId: string,
    lat: number,
    lng: number,
  ) {
    // Replace if exists
    this.connections = this.connections.filter(
      (conn) => conn.pharmacyId !== pharmacyId,
    );
    this.connections.push({
      pharmacyId,
      socketId,
      latitude: lat,
      longitude: lng,
    });
  }

  removeSocket(socketId: string) {
    this.connections = this.connections.filter(
      (conn) => conn.socketId !== socketId,
    );
  }

  findNearbySockets(lat: number, lng: number, radiusKm: number): string[] {
    console.log('connections:', this.connections);
    return this.connections
      .filter(
        (conn) =>
          this.getDistanceInKm(lat, lng, conn.latitude, conn.longitude) <=
          radiusKm,
      )
      .map((conn) => conn.socketId);
  }

  private getDistanceInKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
