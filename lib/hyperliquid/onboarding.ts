// lib/hyperliquid/onboarding.ts
import { usePrivy } from '@privy-io/react-auth';
import { addHyperliquidNetwork, switchToHyperliquidNetwork, isOnHyperliquidNetwork } from './network';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  action?: () => Promise<boolean>;
}

/**
 * Custom hook for Hyperliquid onboarding process
 */
export const useHyperliquidOnboarding = () => {
  const { ready, authenticated, user, connectWallet, linkWallet } = usePrivy();

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'wallet_connection',
      title: 'Connect EVM Wallet',
      description: 'Connect your EVM-compatible wallet or create an embedded wallet',
      status: authenticated && user ? 'completed' : 'pending',
      action: async () => {
        try {
          if (!authenticated) {
            await connectWallet();
          }
          return true;
        } catch (error) {
          console.error('Failed to connect wallet:', error);
          return false;
        }
      }
    },
    {
      id: 'add_hyperliquid_network',
      title: 'Add Hyperliquid Network',
      description: 'Add Hyperliquid network to your wallet for trading',
      status: 'pending',
      action: async () => {
        try {
          const wallet = user?.linkedAccounts?.find(account => account.type === 'wallet');
          if (!wallet) {
            throw new Error('No wallet connected');
          }

          // Get wallet provider
          const provider = (window as any).ethereum;
          if (!provider) {
            throw new Error('No Ethereum provider found');
          }

          const isTestnet = process.env.NODE_ENV === 'development';
          return await addHyperliquidNetwork(provider, isTestnet);
        } catch (error) {
          console.error('Failed to add Hyperliquid network:', error);
          return false;
        }
      }
    },
    {
      id: 'switch_to_hyperliquid',
      title: 'Switch to Hyperliquid',
      description: 'Switch your wallet to Hyperliquid network for trading',
      status: 'pending',
      action: async () => {
        try {
          const provider = (window as any).ethereum;
          if (!provider) {
            throw new Error('No Ethereum provider found');
          }

          const isTestnet = process.env.NODE_ENV === 'development';
          return await switchToHyperliquidNetwork(provider, isTestnet);
        } catch (error) {
          console.error('Failed to switch to Hyperliquid network:', error);
          return false;
        }
      }
    },
    {
      id: 'verify_network',
      title: 'Verify Network Connection',
      description: 'Confirm you are connected to Hyperliquid network',
      status: 'pending',
      action: async () => {
        try {
          const provider = (window as any).ethereum;
          if (!provider) {
            return false;
          }

          const chainId = await provider.request({ method: 'eth_chainId' });
          return isOnHyperliquidNetwork(chainId);
        } catch (error) {
          console.error('Failed to verify network:', error);
          return false;
        }
      }
    }
  ];

  const executeStep = async (stepId: string): Promise<boolean> => {
    const step = onboardingSteps.find(s => s.id === stepId);
    if (!step || !step.action) {
      return false;
    }

    step.status = 'in_progress';
    try {
      const success = await step.action();
      step.status = success ? 'completed' : 'failed';
      return success;
    } catch (error) {
      step.status = 'failed';
      return false;
    }
  };

  const runFullOnboarding = async (): Promise<boolean> => {
    for (const step of onboardingSteps) {
      if (step.status === 'completed') {
        continue;
      }

      const success = await executeStep(step.id);
      if (!success) {
        console.error(`❌ Onboarding failed at step: ${step.title}`);
        return false;
      }
    }

    console.log('✅ Hyperliquid onboarding completed successfully');
    return true;
  };

  const getOnboardingProgress = (): number => {
    const completedSteps = onboardingSteps.filter(step => step.status === 'completed').length;
    return Math.round((completedSteps / onboardingSteps.length) * 100);
  };

  return {
    ready,
    authenticated,
    user,
    onboardingSteps,
    executeStep,
    runFullOnboarding,
    getOnboardingProgress,
  };
};

/**
 * Utility function to check if user needs onboarding
 */
export const needsOnboarding = (user: any): boolean => {
  if (!user) return true;
  
  // Check if user has an EVM wallet connected
  const hasEVMWallet = user.linkedAccounts?.some((account: any) => 
    account.type === 'wallet' && account.address?.startsWith('0x')
  );
  
  return !hasEVMWallet;
};