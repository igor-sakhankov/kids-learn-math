import React, { createContext, useState, useEffect, useContext } from 'react';
import { loadTreeState, saveTreeState } from '../utils/storage';
import { REWARDS, TREE_STAGES } from '../utils/constants';

const RewardContext = createContext();

const defaultTreeState = {
  leaves: 0,
  sparks: 0,
  flowers: 0,
  stage: TREE_STAGES.SAPLING.name,
  unlockedZones: ['number_city'],
  recentRewards: [],
};

export const RewardProvider = ({ children }) => {
  const [treeState, setTreeStateInternal] = useState(defaultTreeState);
  const [isLoading, setIsLoading] = useState(true);

  // Load tree state on mount
  useEffect(() => {
    const loadInitialTree = async () => {
      try {
        const savedTree = await loadTreeState();
        if (savedTree) {
          setTreeStateInternal({ ...defaultTreeState, ...savedTree });
        }
      } catch (error) {
        console.error('Error loading tree state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialTree();
  }, []);

  // Update tree state and save
  const updateTreeState = async (updates) => {
    try {
      const updated = { ...treeState, ...updates };
      
      // Determine tree stage based on leaves
      let newStage = TREE_STAGES.SAPLING.name;
      if (updated.leaves >= TREE_STAGES.FLOWERING.min) {
        newStage = TREE_STAGES.FLOWERING.name;
      } else if (updated.leaves >= TREE_STAGES.YOUNG_TREE.min) {
        newStage = TREE_STAGES.YOUNG_TREE.name;
      }
      
      updated.stage = newStage;
      
      setTreeStateInternal(updated);
      await saveTreeState(updated);
      
      return updated;
    } catch (error) {
      console.error('Error updating tree state:', error);
      return treeState;
    }
  };

  // Add leaves (from completing lessons)
  const addLeaves = async (count = REWARDS.LEAF_PER_LESSON) => {
    const newLeaves = treeState.leaves + count;
    const newFlowers = Math.floor(newLeaves / REWARDS.FLOWER_AT_LEAVES);
    
    const reward = {
      type: 'leaves',
      count,
      timestamp: new Date().toISOString(),
    };
    
    const recentRewards = [reward, ...treeState.recentRewards].slice(0, 10);
    
    const updated = await updateTreeState({
      leaves: newLeaves,
      flowers: newFlowers,
      recentRewards,
    });
    
    // Check if new zone should be unlocked
    if (updated.stage === TREE_STAGES.FLOWERING.name && 
        !updated.unlockedZones.includes('logic_park')) {
      await unlockZone('logic_park');
    }
    
    return { leaves: count, newStage: updated.stage !== treeState.stage };
  };

  // Add sparks (from completing games)
  const addSparks = async (count) => {
    const reward = {
      type: 'sparks',
      count,
      timestamp: new Date().toISOString(),
    };
    
    const recentRewards = [reward, ...treeState.recentRewards].slice(0, 10);
    
    return await updateTreeState({
      sparks: treeState.sparks + count,
      recentRewards,
    });
  };

  // Unlock a new zone
  const unlockZone = async (zoneName) => {
    if (!treeState.unlockedZones.includes(zoneName)) {
      const reward = {
        type: 'zone',
        zone: zoneName,
        timestamp: new Date().toISOString(),
      };
      
      const recentRewards = [reward, ...treeState.recentRewards].slice(0, 10);
      
      return await updateTreeState({
        unlockedZones: [...treeState.unlockedZones, zoneName],
        recentRewards,
      });
    }
  };

  // Get tree growth progress
  const getGrowthProgress = () => {
    const { leaves, stage } = treeState;
    
    let currentStage = TREE_STAGES.SAPLING;
    let nextStage = TREE_STAGES.YOUNG_TREE;
    
    if (stage === TREE_STAGES.YOUNG_TREE.name) {
      currentStage = TREE_STAGES.YOUNG_TREE;
      nextStage = TREE_STAGES.FLOWERING;
    } else if (stage === TREE_STAGES.FLOWERING.name) {
      currentStage = TREE_STAGES.FLOWERING;
      nextStage = null;
    }
    
    if (!nextStage) {
      return { progress: 100, current: currentStage, next: null };
    }
    
    const range = nextStage.min - currentStage.min;
    const current = leaves - currentStage.min;
    const progress = Math.min(100, (current / range) * 100);
    
    return {
      progress: Math.round(progress),
      current: currentStage,
      next: nextStage,
      leavesUntilNext: nextStage.min - leaves,
    };
  };

  // Get recent rewards for display
  const getRecentRewards = (count = 5) => {
    return treeState.recentRewards.slice(0, count);
  };

  const value = {
    treeState,
    addLeaves,
    addSparks,
    unlockZone,
    getGrowthProgress,
    getRecentRewards,
    isLoading,
  };

  return (
    <RewardContext.Provider value={value}>
      {children}
    </RewardContext.Provider>
  );
};

export const useReward = () => {
  const context = useContext(RewardContext);
  if (!context) {
    throw new Error('useReward must be used within a RewardProvider');
  }
  return context;
};

export default RewardContext;

