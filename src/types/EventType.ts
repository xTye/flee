import { DateInterface } from "./DateType";

export interface EventInterface {
  id?: string;
  title: string;
  description: string;
  contents: string;
  thumbnail: string;
  date: DateInterface;
  createdAt?: Date;
  updatedAt?: Date;
}
