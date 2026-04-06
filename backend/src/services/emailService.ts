import { Resend } from 'resend';

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

        const htmlTemplate = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #16a34a; color: white; padding: 20px; text-align: center;">
                    <h2 style="margin: 0;">Νέα Παραγγελία! 📦</h2>
                </div>
                <div style="padding: 30px; background-color: #fafafa;">
                    <p style="font-size: 16px; color: #333;">Καλησπέρα,</p>
                    <p style="font-size: 16px; color: #333;">Λάβατε μια νέα παραγγελία μέσω της πλατφόρμας Achaia Wood.</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; background-color: white; border-radius: 8px;">
                        <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; width: 35%;"><strong>Πελάτης:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${orderData.customerName}</td></tr>
                        <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Τηλέφωνο:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${orderData.phone}</td></tr>
                        <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Τρόπος Πληρωμής:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${orderData.paymentMethod}</td></tr>
                        <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Παραστατικό:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${orderData.documentType}</td></tr>
                        ${invoiceDetails}
                        <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Αρχείο Απεσταλμένο:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${hasFile}</td></tr>
                    </table>
                    
                    <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                        <strong>Οδηγίες:</strong> <br/>
                        ${orderData.specialInstructions || 'Δεν δόθηκαν επιπλέον οδηγίες.'}
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="https://achaia-wood.vercel.app/admin" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Προβολή στο Admin Panel</a>
                    </div>
                </div>
            </div>
        `;

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
        const htmlTemplate = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
                    <h2 style="margin: 0;">Νέο Μήνυμα Επικοινωνίας ✉️</h2>
                </div>
                <div style="padding: 30px; background-color: #fafafa;">
                    <p style="font-size: 16px; color: #333;">Καλησπέρα,</p>
                    <p style="font-size: 16px; color: #333;">Λάβατε ένα νέο μήνυμα από τη φόρμα επικοινωνίας της ιστοσελίδας.</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; background-color: white; border-radius: 8px;">
                        <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; width: 35%;"><strong>Όνομα:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${messageData.name}</td></tr>
                        <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${messageData.email}</td></tr>
                        <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Τηλέφωνο:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${messageData.phone}</td></tr>
                    </table>
                    
                    <h3 style="margin-top: 25px; color: #555;">Μήνυμα:</h3>
                    <div style="padding: 15px; background-color: white; border: 1px solid #e5e7eb; border-radius: 6px; color: #444; line-height: 1.5;">
                        ${messageData.message.replace(/\n/g, '<br/>')}
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="https://achaia-wood.vercel.app/admin" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Προβολή στο Admin Panel</a>
                    </div>
                </div>
            </div>
        `;

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
