export async function generateResumeImprovement(prompt: string, content: string) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000', // Update in prod
            'X-Title': 'AI Resume Builder',
        },
        body: JSON.stringify({
            model: 'openai/gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert resume writer. Improve the following resume content, rewrite it professionally, and enhance its impact.'
                },
                {
                    role: 'user',
                    content: `Task: ${prompt}\n\nResume Content:\n${content}`
                }
            ]
        })
    });

    if (!response.ok) {
        throw new Error('Failed to generate AI content');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
