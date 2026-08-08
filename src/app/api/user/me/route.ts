import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, localScore } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Missing email' }, { status: 400 });
    }

    await connectToDatabase();
    let user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Sync score if local score is higher (fixes out-of-sync local storage)
    if (typeof localScore === 'number' && localScore > user.score) {
      user.score = localScore;
      await user.save();
    }

    return NextResponse.json({
      score: user.score,
      completedChallenges: user.completedChallenges || [],
      unlockedAreas: user.unlockedAreas || ['home'],
      carbonSaved: user.carbonSaved || 0,
      treesSaved: user.treesSaved || 0,
      waterSaved: user.waterSaved || 0,
      plasticReduced: user.plasticReduced || 0,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}
