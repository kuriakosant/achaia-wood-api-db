import { Request, Response } from 'express';
import Order from '../models/orderModel';
import { sendNewOrderEmail } from '../services/emailService';

// Create a new order (Public)
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerName, phone, paymentMethod, documentType, specialInstructions, fileUrl, afm, companyName } = req.body;
    
    if (!customerName || !phone || !paymentMethod || !documentType) {
      res.status(400).json({ message: 'Τα πεδία Όνομα, Τηλέφωνο, Τρόπος Πληρωμής και Τύπος Παραστατικού είναι υποχρεωτικά.' });
      return;
    }

    const order = await Order.create({
      customerName,
      phone,
      paymentMethod,
      documentType,
      specialInstructions,
      fileUrl,
      afm,
      companyName,
      status: 'Pending'
    });

    // Send email notification non-blocking
    sendNewOrderEmail(order);

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ message: 'Αποτυχία δημιουργίας παραγγελίας', error: error.message });
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: 'Αποτυχία λήψης παραγγελιών', error: error.message });
  }
};

// Update order status (Admin only)
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await Order.findByPk(id);
    if (!order) {
      res.status(404).json({ message: 'Η παραγγελία δεν βρέθηκε' });
      return;
    }

    order.status = status || order.status;
    await order.save();

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: 'Αποτυχία ενημέρωσης παραγγελίας', error: error.message });
  }
};

// Delete order (Admin only)
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    
    if (!order) {
      res.status(404).json({ message: 'Η παραγγελία δεν βρέθηκε' });
      return;
    }

    await order.destroy();
    res.json({ message: 'Η παραγγελία διαγράφηκε' });
  } catch (error: any) {
    res.status(500).json({ message: 'Αποτυχία διαγραφής παραγγελίας', error: error.message });
  }
};
