import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch, request }) => {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  
  console.log('Received access token:', accessToken);

  if (!accessToken) {
    console.log('No access token provided');
    return json({ error: 'No access token provided' }, { status: 401 });
  }

  const division = '0'; // Replace with your actual division number or make it dynamic
  const url = `https://start.exactonline.be/api/v1/${division}/bulk/SalesInvoice/SalesInvoices?$select=InvoiceID,InvoiceNumber,InvoiceDate,AmountFC`;

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching invoices:', response.status, errorText);
      return json({ error: `Failed to fetch invoices: ${response.status} ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    return json(data);
  } catch (error) {
    console.error('Error in server-side invoice fetch:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
