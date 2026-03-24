import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: NextRequest) {
    if (!OPENROUTER_API_KEY) {
        return NextResponse.json({ error: 'OpenRouter API key is not configured' }, { status: 500 });
    }

    try {
        const { resumeData, jobDescription } = await req.json();

        const prompt = `
            You are an expert ATS (Applicant Tracking System) optimizer. 
            Analyze the following resume data and provide a detailed ATS compatibility report.
            
            RESUME DATA:
            ${JSON.stringify(resumeData)}
            
            ${jobDescription ? `TARGET JOB DESCRIPTION:\n${jobDescription}` : ''}
            
            Please return ONLY a JSON object with this exact structure:
            {
                "score": 0-100 integer,
                "analysis": {
                    "completeness": { "score": 0-100, "feedback": "string" },
                    "formatting": { "score": 0-100, "feedback": "string" },
                    "keywords": { "score": 0-100, "feedback": "string", "missing": ["keyword1", "keyword2"] },
                    "matching": { "score": 0-100, "feedback": "string" }
                },
                "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
            }
            
            Criteria for scoring:
            1. Completeness: Are all essential sections (Personal Info, Summary, Experience, Education, Skills) present and well-filled?
            2. Formatting: Is the content structured clearly? (Note: AI analysis of raw data, not the visual CSS).
            3. Keywords: Does the resume use industry-standard keywords? If a Job Description is provided, how well do keywords match?
            4. Matching: Specific relevance to the provided Job Description.
        `;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-001",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            }),
        });

        const data = await response.json();
        const result = JSON.parse(data.choices[0].message.content);

        return NextResponse.json(result);
    } catch (error) {
        console.error('ATS Check Error:', error);
        return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 });
    }
}
