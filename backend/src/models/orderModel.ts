import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

class Order extends Model {
  public id!: number;
  public customerName!: string;
  public phone!: string;
  public paymentMethod!: string;
  public documentType!: string; // Απόδειξη ή Τιμολόγιο
  public specialInstructions!: string;
  public fileUrl!: string; // Base64 payload or an external URL
  public status!: string; // Pending, Reviewed, Completed
  public afm!: string | null;
  public companyName!: string | null;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  documentType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  specialInstructions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fileUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
    allowNull: false,
  },
  afm: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders'
});

export default Order;
