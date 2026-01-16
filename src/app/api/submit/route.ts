import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const webhookUrl = process.env.WEBHOOK_URL;

    if (!webhookUrl) {
      console.error('Missing WEBHOOK_URL environment variable');
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error('Webhook Error:', errorText);
      return NextResponse.json(
        { message: `Webhook server responded with status ${webhookResponse.status}` },
        { status: webhookResponse.status }
      );
    }

    const responseData = await webhookResponse.json();
    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { message: error.message || 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
