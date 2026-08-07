import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const video = formData.get('video') as File;
    const challengeTitle = formData.get('challengeTitle') as string;
    const challengeId = formData.get('challengeId') as string;
    const email = formData.get('email') as string;
    const xp = parseInt(formData.get('xp') as string || '0');

    if (!video || !challengeTitle) {
      return NextResponse.json(
        { message: 'Video and challengeTitle are required.' },
        { status: 400 }
      );
    }

    // Simulate AI processing delay (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // MOCK AI LOGIC:
    // We will randomly approve or reject just so you can test the UI!
    // Let's pretend it analyzes the video successfully most of the time.
    const isApproved = Math.random() > 0.3; // 70% chance to approve

    if (isApproved) {
      if (email && xp > 0) {
        await connectToDatabase();
        await User.findOneAndUpdate({ email }, { 
          $inc: { score: xp },
          $addToSet: { completedChallenges: challengeId }
        });
      }

      return NextResponse.json({
        confidence: 95,
        isApproved: true,
        reason: `I have analyzed the video and confirmed that you completed: "${challengeTitle}". Great job!`
      });
    } else {
      return NextResponse.json({
        confidence: 40,
        isApproved: false,
        reason: "No relevant activity detected in the video. Please upload a clearer video showing you completing the challenge."
      });
    }

  } catch (error: any) {
    console.error('AI Verification Error:', error);
    return NextResponse.json(
      { message: "An error occurred during verification: " + error.message },
      { status: 500 }
    );
  }
}
