import { create } from 'zustand';

type FeatureType = 'map' | 'challenges' | 'impact' | 'calculator' | 'leaderboard' | null;

interface UIState {
  activeFeature: FeatureType;
  setActiveFeature: (feature: FeatureType) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeFeature: null,
  setActiveFeature: (feature) => set({ activeFeature: feature }),
}));
