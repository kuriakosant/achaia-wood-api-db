import express from 'express';
import { ContactMessage } from '../models/contactMessageModel';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// @route   POST /api/contact-messages
// @desc    Submit a new contact message from the frontend public form
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newMessage = await ContactMessage.create({
            name,
            email,
            phone,
            message,
            isRead: false
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error creating contact message:', error);
        res.status(500).json({ message: 'Server error creating contact message' });
    }
});

// @route   GET /api/contact-messages
// @desc    Get all contact messages (newest first)
// @access  Admin
router.get('/', authenticateAdmin, async (req, res) => {
    try {
        const messages = await ContactMessage.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({ message: 'Server error fetching contact messages' });
    }
});

// @route   PUT /api/contact-messages/:id/read
// @desc    Toggle the read status of a message
// @access  Admin
router.put('/:id/read', authenticateAdmin, async (req, res) => {
    try {
        const message = await ContactMessage.findByPk(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        message.isRead = !message.isRead;
        await message.save();

        res.json(message);
    } catch (error) {
        console.error('Error toggling contact message status:', error);
        res.status(500).json({ message: 'Server error toggling contact message status' });
    }
});

// @route   DELETE /api/contact-messages/:id
// @desc    Delete a contact message
// @access  Admin
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        const message = await ContactMessage.findByPk(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        await message.destroy();
        res.json({ message: 'Contact message deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact message:', error);
        res.status(500).json({ message: 'Server error deleting contact message' });
    }
});

export default router;
