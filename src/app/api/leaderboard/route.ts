import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch top 50 users sorted by EP (score)
    const users = await User.aggregate([
      {
        $project: {
          name: 1,
          avatar: 1,
          score: 1,
        }
      },
      { $sort: { score: -1 } },
      { $limit: 50 }
    ]);

    // Add rank and format to match our frontend type
    const leaderboardData = users.map((user, index) => ({
      id: user._id.toString(),
      name: user.name,
      score: user.score,
      level: Math.floor((user.score || 0) / 100),
      avatar: user.avatar,
      rank: index + 1,
    }));

    return NextResponse.json(leaderboardData);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { message: 'Failed to fetch leaderboard data' },
      { status: 500 }
    );
  }
}
