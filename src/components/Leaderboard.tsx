"use client";

import { Trophy, Medal, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

type LeaderUser = {
  id: string;
  name: string;
  score: number;
  level: number;
  avatar: string;
  rank: number;
};

export function Leaderboard() {
  const [leaderData, setLeaderData] = useState<LeaderUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchLeaderboard() {
      try {
        const res = await fetch('/api/leaderboard', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setLeaderData(data);
        }
      } catch (error) {
        console.error("Failed to load leaderboard");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    fetchLeaderboard();
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchLeaderboard();
      }
    }, 15000); // Auto-update every 15 seconds if visible
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const top3 = leaderData.slice(0, 3);
  const rank1 = top3.find(u => u.rank === 1);
  const rank2 = top3.find(u => u.rank === 2);
  const rank3 = top3.find(u => u.rank === 3);

  return (
    <div className="w-full max-w-5xl px-4 py-12 mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-poppins text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 mb-4 inline-flex items-center gap-4">
          <Trophy className="h-10 w-10 text-yellow-400" />
          Global Eco Leaderboard
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg mb-2">
          See how you rank against other eco-warriors around the world. Keep completing challenges to climb the ranks!
        </p>
        <p className="text-emerald-400 font-bold text-xl">
          Ranked by Level & Energy Points
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {leaderData.length > 0 && (
            <div className="hidden md:flex justify-center items-end gap-6 mb-16 mt-12">
              {/* Rank 2 */}
              {rank2 && (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-xl font-bold text-white mb-2 shadow-lg shadow-gray-400/20">
                    {rank2.avatar}
                  </div>
                  <div className="text-gray-200 font-medium mb-2">{rank2.name}</div>
                  <div className="text-emerald-400 font-bold mb-4">Lvl {rank2.level} • {rank2.score.toLocaleString()} EP</div>
                  <div className="w-32 h-32 bg-gradient-to-t from-gray-400/20 to-gray-300/10 rounded-t-lg border-t-2 border-gray-400/50 flex justify-center items-start pt-4">
                    <span className="text-4xl font-bold text-gray-400">2</span>
                  </div>
                </div>
              )}

              {/* Rank 1 */}
              {rank1 && (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                      <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center text-2xl font-bold text-white mb-2 shadow-xl shadow-yellow-500/20 ring-4 ring-yellow-400/30">
                      {rank1.avatar}
                    </div>
                  </div>
                  <div className="text-gray-100 font-bold mb-2">{rank1.name}</div>
                  <div className="text-emerald-400 font-bold mb-4 text-lg">Lvl {rank1.level} • {rank1.score.toLocaleString()} EP</div>
                  <div className="w-40 h-40 bg-gradient-to-t from-yellow-500/20 to-yellow-400/10 rounded-t-lg border-t-2 border-yellow-400/50 flex justify-center items-start pt-4">
                    <span className="text-5xl font-bold text-yellow-500">1</span>
                  </div>
                </div>
              )}

              {/* Rank 3 */}
              {rank3 && (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-xl font-bold text-white mb-2 shadow-lg shadow-amber-700/20">
                    {rank3.avatar}
                  </div>
                  <div className="text-gray-200 font-medium mb-2">{rank3.name}</div>
                  <div className="text-emerald-400 font-bold mb-4">Lvl {rank3.level} • {rank3.score.toLocaleString()} EP</div>
                  <div className="w-32 h-24 bg-gradient-to-t from-amber-700/20 to-amber-600/10 rounded-t-lg border-t-2 border-amber-600/50 flex justify-center items-start pt-4">
                    <span className="text-4xl font-bold text-amber-600">3</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="glass-dark rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="p-4 font-semibold text-gray-300 text-center w-20">Rank</th>
                    <th className="p-4 font-semibold text-gray-300">Eco Warrior</th>
                    <th className="p-4 font-semibold text-gray-300 text-right">Level & EP</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderData.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-gray-400">
                        No eco-warriors found yet!
                      </td>
                    </tr>
                  ) : (
                    leaderData.map((user) => (
                      <tr 
                        key={user.id} 
                        className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                      >
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center">
                            {user.rank === 1 && <Medal className="h-6 w-6 text-yellow-400" />}
                            {user.rank === 2 && <Medal className="h-6 w-6 text-gray-400" />}
                            {user.rank === 3 && <Medal className="h-6 w-6 text-amber-600" />}
                            {user.rank > 3 && <span className="font-bold text-gray-400 group-hover:text-emerald-400 transition-colors">{user.rank}</span>}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md
                              ${user.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 
                                user.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' : 
                                user.rank === 3 ? 'bg-gradient-to-br from-amber-600 to-amber-800' : 
                                'bg-emerald-600/50 border border-emerald-500/30'}`}
                            >
                              {user.avatar}
                            </div>
                            <span className="font-medium text-gray-200 group-hover:text-white transition-colors">{user.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <span className="font-mono font-bold text-emerald-400">Lvl {user.level} • {user.score.toLocaleString()} EP</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
