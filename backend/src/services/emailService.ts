import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// The sender email must be the info@achaiawood.gr
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'info@achaiawood.gr';
const SENDER_PASSWORD = process.env.SENDER_PASSWORD || '';
// The destination email address
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'antoniadis_oe@yahoo.gr';

let transporter: nodemailer.Transporter | null = null;

if (SENDER_PASSWORD) {
    transporter = nodemailer.createTransport({
        host: 'mailgate.cosmotemail.gr',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: SENDER_EMAIL,
            pass: SENDER_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        }
    });
}

export const sendNewOrderEmail = async (orderData: any) => {
    if (!transporter || !SENDER_PASSWORD) {
        console.warn('SENDER_PASSWORD not found. Skipping order email notification.');
        return;
    }

    try {
        const hasFile = orderData.fileUrl ? 'Ναι (Επισυνάπτεται Πίνακας/Αρχείο στην πλατφόρμα)' : 'Όχι';
        const invoiceDetails = orderData.documentType === 'Τιμολόγιο'
            ? `
                <tr><td style="padding: 12px 15px; color: #166534; font-weight: bold; border-bottom: 1px solid #e5e7eb; background-color: #f0fdf4;">ΑΦΜ:</td><td style="padding: 12px 15px; color: #1f2937; border-bottom: 1px solid #e5e7eb; border-left: 1px solid #e5e7eb; background-color: #ffffff;">${orderData.afm || '-'}</td></tr>
                <tr><td style="padding: 12px 15px; color: #166534; font-weight: bold; border-bottom: 1px solid #e5e7eb; background-color: #f0fdf4;">Εταιρεία:</td><td style="padding: 12px 15px; color: #1f2937; border-bottom: 1px solid #e5e7eb; border-left: 1px solid #e5e7eb; background-color: #ffffff;">${orderData.companyName || '-'}</td></tr>
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

        const attachments: any[] = [];
        if (orderData.fileUrl && orderData.fileUrl.startsWith('data:')) {
            const matches = orderData.fileUrl.match(/^data:(.+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                const mimeType = matches[1];
                const base64Data = matches[2];

                let ext = 'bin';
                if (mimeType.includes('image/jpeg')) ext = 'jpg';
                else if (mimeType.includes('image/png')) ext = 'png';
                else if (mimeType.includes('application/pdf')) ext = 'pdf';
                else if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) ext = 'xlsx';
                else if (mimeType.includes('text/plain')) ext = 'txt';
                else if (mimeType.includes('csv')) ext = 'csv';

                attachments.push({
                    filename: `${(orderData.customerName || 'Paraggelia').replace(/\s+/g, '_')}_Αρχείο.${ext}`,
                    content: Buffer.from(base64Data, 'base64')
                });
            }
        }

        await transporter.sendMail({
            from: `"Achaia Wood" <${SENDER_EMAIL}>`,
            to: ADMIN_EMAIL,
            subject: `Νέα Παραγγελία από: ${orderData.customerName}`,
            html: htmlTemplate,
            attachments: attachments.length > 0 ? attachments : undefined
        });
        console.log('Order notification email sent successfully.');
    } catch (error) {
        console.error('Failed to send order notification email:', error);
    }
};

export const sendNewContactMessageEmail = async (messageData: any) => {
    if (!transporter || !SENDER_PASSWORD) {
        console.warn('SENDER_PASSWORD not found. Skipping contact message email notification.');
        return;
    }

    try {
        let htmlTemplate = fs.readFileSync(path.join(__dirname, '../templates/messageTemplate.html'), 'utf8');

        htmlTemplate = htmlTemplate
            .split('{{name}}').join(messageData.name || '')
            .split('{{email}}').join(messageData.email || '')
            .split('{{phone}}').join(messageData.phone || '')
            .split('{{message}}').join((messageData.message || '').replace(/\n/g, '<br/>'));

        await transporter.sendMail({
            from: `"Achaia Wood" <${SENDER_EMAIL}>`,
            to: ADMIN_EMAIL,
            subject: `Νέο Μήνυμα από τη φόρμα: ${messageData.name}`,
            html: htmlTemplate,
        });
        console.log('Contact message notification email sent successfully.');
    } catch (error) {
        console.error('Failed to send contact message notification email:', error);
    }
};


