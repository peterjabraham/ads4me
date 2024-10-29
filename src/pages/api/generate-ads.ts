import OpenAI from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const dbPath = path.join(process.cwd(), 'liked-headlines.json');

function getLikedHeadlines() {
  if (!fs.existsSync(dbPath)) {
    return [];
  }
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { 
    brandName, 
    product, 
    userBenefit, 
    promotion, 
    audience, 
    goal, 
    keywords, 
    additionalRules, 
    csvData,
    useLikedHeadlines,
    likedHeadlines 
  } = req.body;

  if (!brandName && !product && !userBenefit && !promotion && !audience && !goal && !keywords && !csvData) {
    return res.status(400).json({ message: 'At least one field is required' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ message: 'OpenAI API key is not set' });
  }

  try {
    let likedHeadlinesPrompt = '';
    if (useLikedHeadlines && likedHeadlines && likedHeadlines.length > 0) {
      likedHeadlinesPrompt = `Previously liked headlines for reference:\n${likedHeadlines.map((h: any) => `- ${h.headline}`).join('\n')}\n\n`;
    }

    const prompt = `You have a deep understanding of the writing techniques of advertising legends like David Ogilvy, Dave Trott, Bill Bernbach, and Joseph Sugarman. Your ad text should be engaging and actionable.

    ${likedHeadlinesPrompt}Generate 5 ad headlines and primary text for the following:
    Brand: ${brandName}
    Product: ${product}
    User Benefit: ${userBenefit}
    Promotion: ${promotion}
    Target Audience: ${audience}
    Goal: ${goal}
    Keywords: ${keywords}
    Additional Rules and Exclusions: ${additionalRules}
    CSV Data: ${csvData}

    Important Rules:
    1. Never truncate words - only use complete words
    2. If approaching character limit, use shorter complete words instead of cutting words off
    3. Headlines must be 40 characters or less, using complete words only
    4. Primary text must be 125 characters or less, using complete words only
    5. Apply engaging and actionable writing techniques
    6. Ensure each headline and text makes complete sense
    7. No ellipsis or partial words

    Format the response as JSON with the following structure:
    {
      "ads": [
        {
          "headline": "Complete headline here (max 40 chars)",
          "primaryText": "Complete primary text here (max 125 chars)"
        },
        // ... (4 more similar objects)
      ]
    }
    
    Important:
    1. Do not include any markdown formatting in your response
    2. Return only the JSON object
    3. Verify that no words are cut off in the middle`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.7, // Slightly increased for more creative variations
    });

    const result = completion.choices[0].message.content;
    
    // Remove any potential markdown formatting
    const cleanedResult = result?.replace(/```json\n?|\n?```/g, '').trim();
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanedResult || '{"ads": []}');
      
      // Additional validation to ensure no partial words
      parsedResult.ads = parsedResult.ads.map((ad: any) => {
        // If we need to truncate, do it at word boundaries
        const truncateToWordBoundary = (text: string, limit: number) => {
          if (text.length <= limit) return text;
          const truncated = text.substring(0, limit);
          // Find the last space before the limit
          const lastSpace = truncated.lastIndexOf(' ');
          return lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated;
        };

        return {
          headline: truncateToWordBoundary(ad.headline, 40),
          primaryText: truncateToWordBoundary(ad.primaryText, 125)
        };
      });
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.log('Raw API response:', result);
      return res.status(500).json({ message: 'Error parsing API response' });
    }

    res.status(200).json(parsedResult);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while generating the ads' });
  }
}
