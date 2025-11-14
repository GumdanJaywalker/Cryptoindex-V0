'use client';

import React, { useState, useEffect } from 'react';
import { useLogin, useLogout, usePrivy, useWallets } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Loader2, CheckCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WalletConnectionState } from './types';
import { formatAddress } from './utils';
import Ripple from '@/components/magicui/ripple';
import BorderBeam from '@/components/magicui/border-beam';
import { WalletDropdown } from './WalletDropdown';

interface WalletConnectButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
}

export function WalletConnectButton({ 
  className, 
  variant = 'default', 
  size = 'default' 
}: WalletConnectButtonProps) {
  const { login } = useLogin();
  const { logout } = useLogout();
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  
  const [connectionState, setConnectionState] = useState<WalletConnectionState>(
    WalletConnectionState.DISCONNECTED
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Update connection state based on Privy status
  useEffect(() => {
    console.log('Privy Status:', { ready, authenticated, user: !!user });
    
    if (!ready) {
      // Privy is initializing, show disconnected state instead of connecting
      setConnectionState(WalletConnectionState.DISCONNECTED);
    } else if (authenticated && user) {
      console.log('User authenticated successfully');
      setConnectionState(WalletConnectionState.CONNECTED);
    } else {
      console.log('User not authenticated or ready');
      setConnectionState(WalletConnectionState.DISCONNECTED);
    }
  }, [ready, authenticated, user]);

  // Extract wallet address for display
  const getWalletAddress = (): string | null => {
    // Try to get address from user.wallet first
    if (user?.wallet?.address) {
      return user.wallet.address;
    }
    
    // Fallback to first wallet from useWallets hook
    if (wallets.length > 0 && wallets[0].address) {
      return wallets[0].address;
    }
    
    // Try linked accounts
    if (user?.linkedAccounts) {
      const walletAccount = user.linkedAccounts.find(
        account => account.address && account.type === 'wallet'
      );
      if (walletAccount?.address) {
        return walletAccount.address;
      }
    }
    
    return null;
  };

  // Use the utility function for formatting addresses

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      setConnectionState(WalletConnectionState.CONNECTING);
      await login();
      // Don't manually set state here - let useEffect handle it
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setConnectionState(WalletConnectionState.ERROR);
      // Reset to disconnected after a brief error display
      setTimeout(() => {
        setConnectionState(WalletConnectionState.DISCONNECTED);
      }, 2000);
    }
  };

  // Handle wallet disconnection
  const handleDisconnect = async () => {
    try {
      await logout();
      setConnectionState(WalletConnectionState.DISCONNECTED);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  // Render button content based on state
  const renderButtonContent = () => {
    const walletAddress = getWalletAddress();

    switch (connectionState) {
      case WalletConnectionState.CONNECTING:
        return (
          <div className="relative flex items-center gap-2">
            <div className="relative">
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
            </div>
            <span className="font-medium">Connecting...</span>
          </div>
        );

      case WalletConnectionState.CONNECTED:
        const walletAddress = getWalletAddress();
        return (
          <div className="relative flex items-center gap-2">
            <div className="relative">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <div className="absolute inset-0 rounded-full bg-green-400/20 animate-pulse" />
            </div>
            <span className="font-medium">
              {walletAddress ? formatAddress(walletAddress) : 'Connected'}
            </span>
            <ChevronDown className="w-3 h-3 opacity-60 hover:opacity-100 transition-opacity" />
          </div>
        );

      case WalletConnectionState.ERROR:
        return (
          <div className="relative flex items-center gap-2">
            <Wallet className="w-4 h-4 text-red-400" />
            <span className="font-medium">Connection Failed</span>
          </div>
        );

      case WalletConnectionState.DISCONNECTED:
      default:
        return (
          <div className="relative flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            <span className="font-medium">Connect Wallet</span>
          </div>
        );
    }
  };

  // Determine button click handler
  const handleClick = () => {
    if (connectionState === WalletConnectionState.CONNECTED) {
      // If connected, toggle dropdown instead of disconnecting
      setDropdownOpen(!dropdownOpen);
    } else if (connectionState === WalletConnectionState.DISCONNECTED) {
      handleConnect();
    }
    // Do nothing for CONNECTING or ERROR states
  };

  // Determine if button should be disabled
  const isDisabled = connectionState === WalletConnectionState.CONNECTING;

  return (
    <div className="relative">
      {/* Connected state - render as popover trigger */}
      {connectionState === WalletConnectionState.CONNECTED ? (
        <WalletDropdown
          isOpen={dropdownOpen}
          onOpenChange={setDropdownOpen}
          onDisconnect={handleDisconnect}
          className={className}
        />
      ) : (
        <Button
          onClick={handleClick}
          disabled={isDisabled}
          variant="ghost"
          size={size}
          className={cn(
            'relative overflow-hidden transition-all duration-300 ease-out',
            'border-0 font-medium bg-transparent text-white',
            'active:scale-95',

            // Connecting state
            connectionState === WalletConnectionState.CONNECTING && [
              'cursor-not-allowed',
              'animate-pulse'
            ],

            // Error state
            connectionState === WalletConnectionState.ERROR && [
              'text-red-400'
            ],

            className
          )}
        >
          {/* Content */}
          <div className="relative z-10">
            {renderButtonContent()}
          </div>
        </Button>
      )}
    </div>
  );
}