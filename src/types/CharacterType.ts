export interface CharacterInterface {
  id: string;
  name: string;
  title: string;
  class: string;
  userId: string;
  sheet: string;
  sheetType: string;
  home: string;
  description: string;
  image: string;
  moves: string;
  movesImage: string;
  type: string;
  hidden: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const CharacterInterfaceDefault: CharacterInterface = {
  id: "",
  userId: "",
  name: "",
  title: "",
  class: "",
  sheet: "",
  sheetType: "",
  home: "",
  description: "",
  image: "",
  moves: "",
  movesImage: "",
  type: "",
  hidden: true,
};
