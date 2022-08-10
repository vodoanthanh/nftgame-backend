import { Model, Optional } from "sequelize/types";

export interface UserAttributes {
    id: number;
    nonce: string;
    walletID: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserCreationAttributes extends Optional<UserAttributes, "id" | "nonce"> { }

export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes { }
