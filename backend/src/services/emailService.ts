import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

// Initialize Resend with API key from environment variables
// Make sure to add RESEND_API_KEY to your Vercel environment variables.
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// The destination email address for all notifications
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'antoniadis_oe@yahoo.gr'; 
// The sender email must be verified on Resend (e.g. notifications@achaiawood.gr or onboarding@resend.dev for testing)
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

export const sendNewOrderEmail = async (orderData: any) => {
    if (!resend) {
        console.warn('RESEND_API_KEY not found. Skipping order email notification.');
        return;
    }

    try {
        const hasFile = orderData.fileUrl ? 'Ναι (Επισυνάπτεται Πίνακας/Αρχείο στην πλατφόρμα)' : 'Όχι';
        const invoiceDetails = orderData.documentType === 'Τιμολόγιο' 
            ? `
                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>ΑΦΜ:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${orderData.afm || '-'}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Εταιρεία:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${orderData.companyName || '-'}</td></tr>
              `
            : '';

        let htmlTemplate = fs.readFileSync(path.join(__dirname, '../templates/orderTemplate.html'), 'utf8');

        htmlTemplate = htmlTemplate
            .split('{{customerName}}').join(orderData.customerName || '')
            .split('{{phone}}').join(orderData.phone || '')
            .split('{{paymentMethod}}').join(orderData.paymentMethod || '')
            .split('{{documentType}}').join(orderData.documentType || '')
            .split('{{invoiceDetails}}').join(invoiceDetails)
            .split('{{hasFile}}').join(hasFile)
            .split('{{specialInstructions}}').join(orderData.specialInstructions || 'Δεν δόθηκαν επιπλέον οδηγίες.');

        await resend.emails.send({
            from: `Achaia Wood <${SENDER_EMAIL}>`,
            to: [ADMIN_EMAIL],
            subject: `Νέα Παραγγελία από: ${orderData.customerName}`,
            html: htmlTemplate,
        });
        console.log('Order notification email sent successfully.');
    } catch (error) {
        console.error('Failed to send order notification email:', error);
    }
};

export const sendNewContactMessageEmail = async (messageData: any) => {
    if (!resend) {
        console.warn('RESEND_API_KEY not found. Skipping contact message email notification.');
        return;
    }

    try {
        let htmlTemplate = fs.readFileSync(path.join(__dirname, '../templates/messageTemplate.html'), 'utf8');
        
        htmlTemplate = htmlTemplate
            .split('{{name}}').join(messageData.name || '')
            .split('{{email}}').join(messageData.email || '')
            .split('{{phone}}').join(messageData.phone || '')
            .split('{{message}}').join((messageData.message || '').replace(/\n/g, '<br/>'));

        await resend.emails.send({
            from: `Achaia Wood <${SENDER_EMAIL}>`,
            to: [ADMIN_EMAIL],
            subject: `Νέο Μήνυμα από τη φόρμα: ${messageData.name}`,
            html: htmlTemplate,
        });
        console.log('Contact message notification email sent successfully.');
    } catch (error) {
        console.error('Failed to send contact message notification email:', error);
    }
};
