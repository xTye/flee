export interface MarkerInterface {
  id?: string;
  name: string;
  description: string;
  x: number;
  y: number;
  color: string;
  maps: string[];
  createdAt?: Date;
  updatedAt?: Date;
  previousData?: MarkerInterface;
}
