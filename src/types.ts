/**
 * Types and interfaces for the Timp Așteptare Giurgiu – Ruse application.
 */

export type Direction = 'RO_BG' | 'BG_RO'; // RO -> BG (Romania to Bulgaria), BG -> RO (Bulgaria to Romania)
export type VehicleType = 'car' | 'truck';  // Car (Turism), Truck (Camion)
export type TrafficStatus = 'fluid' | 'mediu' | 'aglomerat';

export interface BorderReport {
  id: string;
  minutes: number;
  vehicleType: VehicleType;
  direction: Direction;
  timestamp: string; // ISO String
  userId: string;
}

export interface ChatMessage {
  id: string;
  username: string;
  text: string;
  direction: Direction;
  timestamp: string; // ISO String
}

export interface EtaInfo {
  direction: Direction;
  carWaitMinutes: number;
  truckWaitMinutes: number;
  carStatus: TrafficStatus;
  truckStatus: TrafficStatus;
  totalReports24h: number;
  lastUpdated: string; // ISO string
}

export interface LiveStats {
  onlineCount: number;
  etaRO_BG: EtaInfo;
  etaBG_RO: EtaInfo;
  recentReports: BorderReport[];
}

export interface PlanningEstimation {
  hourStamp: string; // e.g. "14:00"
  predictedCarMinutes: number;
  predictedTruckMinutes: number;
  carStatus: TrafficStatus;
  truckStatus: TrafficStatus;
  confidenceScore: number; // 0-100%
  baseHistoricalCar: number;
  baseHistoricalTruck: number;
}
