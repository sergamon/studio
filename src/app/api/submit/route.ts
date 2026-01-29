import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    console.log('Submitting data to webhook:', JSON.stringify(requestBody, null, 2));

    const webhookUrl = process.env.WEBHOOK_URL || 'https://primary-production-48a2.up.railway.app/webhook/48622859-1dfe-4299-b129-8ea8c74bc2ee';

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error('Webhook Error Response:', errorText);
      console.error('Webhook Status:', webhookResponse.status);

      // Special handling for n8n "Unused Respond to Webhook node" error which is technically a 500 but means the workflow ran.
      if (webhookResponse.status === 500 && errorText.includes('Unused Respond to Webhook node')) {
        console.warn('Handling n8n 500 error as success due to known workflow issue:', errorText);
        return NextResponse.json({
          message: 'Submission accepted (with upstream workflow warning)',
          warning: errorText
        });
      }

      return NextResponse.json(
        {
          message: `Webhook server responded with status ${webhookResponse.status}`,
          details: errorText
        },
        { status: webhookResponse.status }
      );
    }

    const contentType = webhookResponse.headers.get('content-type');
    let responseData;

    if (contentType && contentType.includes('application/json')) {
      responseData = await webhookResponse.json().catch(() => ({
        message: 'Submission accepted',
        note: 'Response was empty or invalid JSON'
      }));
    } else {
      const textData = await webhookResponse.text();
      responseData = { message: 'Submission successful', raw: textData };
    }

    console.log('Webhook Success Response:', responseData);
    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { message: error.message || 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
