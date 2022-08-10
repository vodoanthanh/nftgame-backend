import { EventName } from "@/config/eventSetting";
import { Model, Optional } from "sequelize";

export interface EventAttributes {
  id: number;
  contractName: string;
  contractAddress: string;
  transHash: string;
  name: EventName;
  param: object;
  block: number;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EventCreationAttributes extends Optional<EventAttributes, "id"> { }

export interface EventInstance extends Model<EventAttributes, EventCreationAttributes>,
  EventAttributes {

}
