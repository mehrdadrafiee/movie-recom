import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface ExcludeMovie {
  title: string;
  year: string;
}

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
      ? `\n\nExclude these movies from your recommendations: ${excludeMovies.map((m: ExcludeMovie) => `${m.title} (${m.year})`).join(', ')}`
      : '';

    const prompt = `Given the movie "${favoriteMovie}", recommend 5 similar movies. For each recommendation, provide:
1. Movie title
2. Year released
3. Brief reason why it's similar (1-2 sentences)
4. Genre
5. Where to watch (streaming platforms like Netflix, Amazon Prime, Hulu, Disney+, HBO Max, Apple TV+, or "Not available on major streaming platforms")${excludeList}

IMPORTANT: Respond with ONLY a valid JSON array. Do not include any explanatory text, markdown formatting, or other content. The response must be a valid JSON array with objects containing: title, year, reason, genre, and streaming fields.

Example format:
[
  {
    "title": "Movie Title",
    "year": "2023",
    "reason": "Similar plot and themes",
    "genre": "Action/Adventure",
    "streaming": "Netflix, Amazon Prime"
  }
]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a movie recommendation expert. You must respond with ONLY valid JSON arrays. Do not include any explanatory text, markdown formatting, or other content outside the JSON structure."
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

    // Log the raw response for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Raw OpenAI response:', response);
    }

    // Try to parse the JSON response
    let recommendations;
    try {
      recommendations = JSON.parse(response);
    } catch (parseError) {
      // If parsing fails, try to extract JSON from the response
      console.warn('Failed to parse JSON response directly:', parseError);
      
      // Try multiple patterns to extract JSON
      let jsonMatch = response.match(/\[.*\]/s); // Array pattern
      
      if (!jsonMatch) {
        // Try to find JSON wrapped in markdown code blocks
        const markdownMatch = response.match(/```(?:json)?\s*(\[.*\])\s*```/s);
        if (markdownMatch) {
          jsonMatch = [markdownMatch[1]]; // Create a match array with the captured group
        }
      }
      
      if (!jsonMatch) {
        // Try to find any JSON object or array
        jsonMatch = response.match(/(\[.*\]|\{.*\})/s);
      }
      
      if (jsonMatch) {
        try {
          recommendations = JSON.parse(jsonMatch[0]);
        } catch (nestedParseError) {
          console.warn('Failed to parse extracted JSON:', nestedParseError);
          throw new Error('Invalid JSON response from OpenAI');
        }
      } else {
        throw new Error('No valid JSON found in OpenAI response');
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