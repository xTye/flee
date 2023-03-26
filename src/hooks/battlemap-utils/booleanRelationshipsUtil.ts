import { BattlemapInterface } from "../../types/BattlemapType";

export const isFogLayerActive = (battlemap: BattlemapInterface) => {
  return battlemap.map.hasLayer(battlemap.fog.layer);
};
