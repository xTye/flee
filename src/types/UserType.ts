export interface UserInterface {
  id: string;
  name: string;
  email: string;
  tools: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
