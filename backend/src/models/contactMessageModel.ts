import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';

export interface ContactMessageAttributes {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContactMessageCreationAttributes extends Optional<ContactMessageAttributes, 'id' | 'isRead'> {}

export class ContactMessage extends Model<ContactMessageAttributes, ContactMessageCreationAttributes> implements ContactMessageAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string;
  public message!: string;
  public isRead!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ContactMessage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ContactMessage',
    tableName: 'ContactMessages',
  }
);

export default ContactMessage;
