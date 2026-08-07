import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  ecoScore: number;
  xp: number;
  carbonSaved: number;
  treesSaved: number;
  waterSaved: number;
  plasticReduced: number;
  unlockedAreas: string[];
  completedChallenges: string[];
  
  // Actions
  addXP: (amount: number) => void;
  updateStats: (stats: Partial<Omit<UserState, 'ecoScore' | 'xp' | 'unlockedAreas' | 'completedChallenges' | 'addXP' | 'updateStats' | 'completeChallenge' | 'unlockArea' | 'reset'>>) => void;
  completeChallenge: (id: string, xpReward: number) => void;
  unlockArea: (areaId: string) => void;
  reset: () => void;
}

export const useStore = create<UserState>()(
  persist(
    (set) => ({
      ecoScore: 0,
  xp: 0,
  carbonSaved: 0,
  treesSaved: 0,
  waterSaved: 0,
  plasticReduced: 0,
  unlockedAreas: ['home'],
  completedChallenges: [],

  addXP: (amount) => set((state) => ({ 
    xp: state.xp + amount,
    ecoScore: Math.floor((state.xp + amount) / 100) // 100 XP = 1 Eco Score
  })),
  
  updateStats: (stats) => set((state) => ({ ...state, ...stats })),
  
  completeChallenge: (id, xpReward) => set((state) => {
    if (state.completedChallenges.includes(id)) return state;
    
    const newXp = state.xp + xpReward;
    return {
      completedChallenges: [...state.completedChallenges, id],
      xp: newXp,
      ecoScore: Math.floor(newXp / 100)
    };
  }),

  unlockArea: (areaId) => set((state) => {
    if (state.unlockedAreas.includes(areaId)) return state;
    return { unlockedAreas: [...state.unlockedAreas, areaId] };
  }),
  reset: () => set({
    ecoScore: 0,
    xp: 0,
    carbonSaved: 0,
    treesSaved: 0,
    waterSaved: 0,
    plasticReduced: 0,
    unlockedAreas: ['home'],
    completedChallenges: [],
  })
}), { name: 'eco-store' }));
