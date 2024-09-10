import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { post as apiPost } from '$lib/apiService';

export const POST: RequestHandler = async ({ params, request }) => {
  try {
    const templateId = params.templateId;
    const { to, subject, emailVariables } = await request.json();

    const emailData = {
      sender: { email: 'your-sender-email@example.com', name: 'Your Sender Name' }, // TODO: Change to actual sender
      to: [{ email: to }],
      subject: subject,
      templateId: templateId,
      params: emailVariables
    };

    const response = await apiPost('https://api.brevo.com/v3/smtp/email', emailData, {
      headers: {
        'api-key': process.env.BREVO_API_KEY || '',
        'Content-Type': 'application/json'
      }
    });

    return json({ success: true, messageId: response.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    return json({ success: false, error: 'Error sending email' }, { status: 500 });
  }
};
