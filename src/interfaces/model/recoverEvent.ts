import { Model, Optional } from "sequelize";

export interface RecoverEventAttributes {
  id: number;
  contractName?: string;
  block?: number;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RecoverEventCreationAttributes extends Optional<RecoverEventAttributes, "id"> { }

export interface RecoverEventInstance extends Model<RecoverEventAttributes, RecoverEventCreationAttributes>,
  RecoverEventAttributes {

}
