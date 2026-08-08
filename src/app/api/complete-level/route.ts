import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

const nextLevelMap: Record<string, string> = {
  home: 'forest',
  forest: 'solar',
  solar: 'wind',
  wind: '' // max
};

export async function POST(req: NextRequest) {
  try {
    const { email, levelId } = await req.json();

    if (!email || !levelId) {
      return NextResponse.json({ message: 'Missing email or levelId' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const nextLevelId = nextLevelMap[levelId];
    
    // Add the current level to completedLevels if not already there
    if (!user.completedLevels.includes(levelId)) {
      user.completedLevels.push(levelId);
      
      // Unlock the next level
      if (nextLevelId && !user.unlockedAreas.includes(nextLevelId)) {
        user.unlockedAreas.push(nextLevelId);
      }
      
      await user.save();
    }

    return NextResponse.json({
      success: true,
      completedLevels: user.completedLevels,
      unlockedAreas: user.unlockedAreas
    });
  } catch (error: any) {
    console.error('Error completing level:', error);
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}
