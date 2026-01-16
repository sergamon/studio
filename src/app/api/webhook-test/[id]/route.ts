import { NextResponse } from 'next/server';

// Fix for Next.js 15+ params type
export async function POST(request: Request, { params }: { params: any }) {
    try {
        const { id } = await params;
        const body = await request.json();
        console.log('Webhook recibido para ID:', id, 'payload:', body);
        return NextResponse.json({ message: 'Webhook recibido', id, received: body });
    } catch (error) {
        console.error('Error en webhook:', error);
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
}

export async function GET(_: Request, { params }: { params: any }) {
    const { id } = await params;
    return NextResponse.json({ message: 'Webhook GET test', id });
}
