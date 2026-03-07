import { NextRequest, NextResponse } from 'next/server';
import { generateResumeImprovement } from '@/lib/openrouter';

export async function POST(request: NextRequest) {
    try {
        const { prompt, content } = await request.json();
        if (!prompt || !content) {
            return NextResponse.json({ error: 'Missing prompt or content' }, { status: 400 });
        }

        const improvedContent = await generateResumeImprovement(prompt, content);
        return NextResponse.json({ improvedContent });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
