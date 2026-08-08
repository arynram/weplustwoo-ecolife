import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const video = formData.get('video') as File | null;
    const challengeTitle = formData.get('challengeTitle') as string;
    const challengeId = formData.get('challengeId') as string;
    const email = formData.get('email') as string;
    const declaration = formData.get('declaration') as string;
    const xp = parseInt(formData.get('xp') as string || '0');

    const envRewardsStr = formData.get('envRewards') as string;
    let envRewards = {};

    if (envRewardsStr) {
      try {
        envRewards = JSON.parse(envRewardsStr);
      } catch (e) {
        console.error('Failed to parse envRewards', e);
      }
    }

    // Challenge title and declaration are required.
    // Video is optional.
    if (!challengeTitle || declaration !== 'true') {
      return NextResponse.json(
        { message: 'Challenge answer and declaration are required.' },
        { status: 400 }
      );
    }

    // If video is provided, simulate AI verification.
    // If no video is provided, directly approve the submission.
    let isApproved = true;

    if (video) {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // MOCK AI LOGIC
      isApproved = Math.random() > 0.3;
    }

    if (isApproved) {
      if (email && xp > 0) {
        await connectToDatabase();

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const incData: any = { score: xp };

        if (envRewards && Object.keys(envRewards).length > 0) {
          for (const [key, val] of Object.entries(envRewards)) {
            if (
              ['carbonSaved', 'treesSaved', 'waterSaved', 'plasticReduced'].includes(key)
            ) {
              incData[key] = val;
            }
          }
        }

        const updatedUser = await User.findOneAndUpdate(
          {
            email,
            $or: [
              { [`challengeCompletions.${challengeId}`]: { $exists: false } },
              { [`challengeCompletions.${challengeId}`]: { $lt: twentyFourHoursAgo } }
            ]
          },
          {
            $inc: incData,
            $addToSet: { completedChallenges: challengeId },
            $set: { [`challengeCompletions.${challengeId}`]: new Date() }
          },
          { returnDocument: 'after' } // Return updated doc
        );

        if (!updatedUser) {
          // Could mean user not found, OR they are still in cooldown.
          // To be safe, we reject if we couldn't update.
          return NextResponse.json({
            isApproved: false,
            reason: 'Challenge is still in cooldown or user not found. Please try again later.'
          }, { status: 400 });
        }
      }

      return NextResponse.json({
        confidence: video ? 95 : 100,
        isApproved: true,
        reason: video
          ? `I have analyzed the video and confirmed that you completed: "${challengeTitle}". Great job!`
          : `Your declaration has been accepted. "${challengeTitle}" challenge completed. Great job!`
      });
    } else {
      return NextResponse.json({
        confidence: 40,
        isApproved: false,
        reason:
          'No relevant activity detected in the video. Please upload a clearer video showing you completing the challenge.'
      });
    }

  } catch (error: any) {
    console.error('AI Verification Error:', error);

    return NextResponse.json(
      {
        message:
          'An error occurred during verification: ' + error.message
      },
      { status: 500 }
    );
  }
}