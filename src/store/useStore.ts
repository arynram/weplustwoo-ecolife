import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  ecoScore: number;
  xp: number;
  lifetimeXp: number;
  carbonSaved: number;
  treesSaved: number;
  waterSaved: number;
  plasticReduced: number;
  unlockedAreas: string[];
  completedChallenges: string[];
  challengeCompletions: Record<string, number>;
  restoredObjects: Record<string, boolean>;

  // Actions
  addXP: (amount: number) => void;
  updateStats: (
    stats: Partial<
      Omit<
        UserState,
        'addXP' | 'updateStats' | 'completeChallenge' | 'unlockArea' | 'reset' | 'restoreObject'
      >
    >
  ) => void;
  completeChallenge: (
    id: string,
    xpReward: number,
    envRewards?: {
      carbonSaved?: number;
      treesSaved?: number;
      waterSaved?: number;
      plasticReduced?: number;
    }
  ) => void;
  unlockArea: (areaId: string) => void;
  restoreObject: (objectId: string, cost: number) => void;
  reset: () => void;
}

export const useStore = create<UserState>()(
  persist(
    (set) => ({
      ecoScore: 0,
      xp: 0,
      lifetimeXp: 0,
      carbonSaved: 0,
      treesSaved: 0,
      waterSaved: 0,
      plasticReduced: 0,
      unlockedAreas: ['home'],
      completedChallenges: [],
      challengeCompletions: {},
      restoredObjects: {},

      addXP: (amount) =>
        set((state) => {
          const currentLifetime = state.lifetimeXp ?? state.xp;
          return {
            xp: state.xp + amount,
            lifetimeXp: amount > 0 ? currentLifetime + amount : currentLifetime,
            ecoScore: Math.floor((state.xp + amount) / 100),
          };
        }),

      updateStats: (stats) => set((state) => ({ ...state, ...stats })),

      completeChallenge: (id, xpReward, envRewards = {}) =>
        set((state) => {
          const now = Date.now();
          const lastCompleted = state.challengeCompletions[id] || 0;
          const isCooldown = now - lastCompleted < 24 * 60 * 60 * 1000;
          
          if (isCooldown) return state;

          const newXp = state.xp + xpReward;
          const currentLifetime = state.lifetimeXp ?? state.xp;

          return {
            completedChallenges: state.completedChallenges.includes(id) ? state.completedChallenges : [...state.completedChallenges, id],
            challengeCompletions: { ...state.challengeCompletions, [id]: now },
            xp: newXp,
            lifetimeXp: currentLifetime + xpReward,
            ecoScore: Math.floor(newXp / 100),
            carbonSaved:
              state.carbonSaved + (envRewards.carbonSaved || 0),
            treesSaved:
              state.treesSaved + (envRewards.treesSaved || 0),
            waterSaved:
              state.waterSaved + (envRewards.waterSaved || 0),
            plasticReduced:
              state.plasticReduced + (envRewards.plasticReduced || 0),
          };
        }),

      unlockArea: (areaId) =>
        set((state) => {
          if (state.unlockedAreas.includes(areaId)) return state;
          return { unlockedAreas: [...state.unlockedAreas, areaId] };
        }),

      restoreObject: (objectId, cost) =>
        set((state) => {
          if (state.restoredObjects[objectId]) return state; // Already restored
          if (state.xp < cost) return state; // Not enough EP

          const newXp = state.xp - cost;
          return {
            xp: newXp,
            ecoScore: Math.floor(newXp / 100),
            restoredObjects: { ...state.restoredObjects, [objectId]: true },
          };
        }),

      reset: () =>
        set({
          ecoScore: 0,
          xp: 0,
          lifetimeXp: 0,
          carbonSaved: 0,
          treesSaved: 0,
          waterSaved: 0,
          plasticReduced: 0,
          unlockedAreas: ['home'],
          completedChallenges: [],
          challengeCompletions: {},
          restoredObjects: {},
        }),
    }),
    { name: 'eco-store' }
  )
);