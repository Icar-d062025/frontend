export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  imageUrl: string;
  co2Emissions: number;
  seats: number;
  owner?: string; // Optional for service vehicles
  company?: string; // Optional for regular vehicles
}

