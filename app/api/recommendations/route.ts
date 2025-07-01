import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { favoriteMovie, excludeMovies = [] } = await request.json();

    if (!favoriteMovie) {
      return NextResponse.json(
        { error: 'Favorite movie is required' },
        { status: 400 }
      );
    }

    const excludeList = excludeMovies.length > 0 
      ? `\n\nPlease exclude these movies from your recommendations: ${excludeMovies.map((m: any) => `${m.title} (${m.year})`).join(', ')}`
      : '';

    const prompt = `Given the movie "${favoriteMovie}", please recommend 5 similar movies. For each recommendation, provide:
1. Movie title
2. Year released
3. Brief reason why it's similar (1-2 sentences)
4. Genre
5. Where to watch (streaming platforms like Netflix, Amazon Prime, Hulu, Disney+, HBO Max, Apple TV+, or "Not available on major streaming platforms")${excludeList}

Format the response as a JSON array with objects containing: title, year, reason, genre, and streaming fields.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a movie recommendation expert. Provide accurate, well-reasoned movie recommendations in the exact JSON format requested."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Try to parse the JSON response
    let recommendations;
    try {
      recommendations = JSON.parse(response);
    } catch (parseError) {
      // If parsing fails, try to extract JSON from the response
      const jsonMatch = response.match(/\[.*\]/s);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from OpenAI');
      }
    }

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error getting movie recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get movie recommendations' },
      { status: 500 }
    );
  }
} 