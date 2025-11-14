'use client';

import React, { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Copy, LogOut, ChevronDown, CheckCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatAddress, copyToClipboard } from './utils';
import { NetworkDisplay } from './NetworkDisplay';
import { toast } from 'react-hot-toast';
import Ripple from '@/components/magicui/ripple';

interface WalletDropdownProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDisconnect: () => void;
  className?: string;
}

export function WalletDropdown({ 
  isOpen, 
  onOpenChange, 
  onDisconnect, 
  className 
}: WalletDropdownProps) {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  
  // State for copy feedback
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

  // Get wallet address
  const getWalletAddress = (): string | null => {
    if (user?.wallet?.address) {
      return user.wallet.address;
    }
    
    if (wallets.length > 0 && wallets[0].address) {
      return wallets[0].address;
    }
    
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

  // Get user email
  const getUserEmail = (): string | null => {
    if (user?.email?.address) {
      return user.email.address;
    }
    
    if (user?.linkedAccounts) {
      const emailAccount = user.linkedAccounts.find(
        account => account.type === 'email'
      );
      if (emailAccount && 'address' in emailAccount) {
        return emailAccount.address as string;
      }
    }
    
    return null;
  };


  // Enhanced address copy with visual feedback
  const handleCopyAddress = async (address: string, label: string = 'Address') => {
    const success = await copyToClipboard(address);
    if (success) {
      // Add to copied items for visual feedback
      setCopiedItems(prev => new Set(prev).add(address));
      
      // Show toast notification
      toast.success(`${label} copied to clipboard!`);
      
      // Remove from copied items after 2 seconds
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(address);
          return newSet;
        });
      }, 2000);
    } else {
      toast.error(`Failed to copy ${label.toLowerCase()}`);
    }
  };
  
  // Check if item was recently copied
  const isRecentlyCopied = (item: string) => copiedItems.has(item);

  // Handle disconnect
  const handleDisconnect = () => {
    onDisconnect();
    onOpenChange(false);
  };

  const walletAddress = getWalletAddress();
  const userEmail = getUserEmail();

  if (!walletAddress) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "relative overflow-hidden transition-all duration-300 ease-out",
              "border-0 font-medium bg-transparent text-white",
              "hover:scale-105 active:scale-95",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand",
              className
            )}
          >
            {/* Ripple effect for connected state */}
            <Ripple 
              mainCircleSize={80} 
              mainCircleOpacity={0.2} 
              numCircles={3}
              className="absolute inset-0" 
            />
            
            {/* Content */}
            <div className="relative z-10 flex items-center gap-2">
              <span className="font-medium">Wallet Connected</span>
              <ChevronDown className="w-3 h-3 opacity-60 hover:opacity-100 transition-opacity" />
            </div>
          </Button>
        </div>
      </PopoverTrigger>
      
      <PopoverContent
        className="w-80 p-0 bg-teal-card border-teal"
        align="end"
        sideOffset={8}
      >
        <Card className="border-0 shadow-lg bg-teal-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                Wallet Information
              </h3>
              <Badge variant="secondary" className="text-xs bg-brand/20 text-brand border-brand/30">
                Connected
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* User Info Section */}
            <div className="space-y-3">
              {/* Wallet Address */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">
                  Wallet Address
                </label>
                <div
                  className="flex items-center gap-2 p-2 bg-teal-card/50 border border-teal rounded-md cursor-pointer hover:bg-teal-card/70 hover:border-white/10 transition-colors"
                  onClick={() => handleCopyAddress(walletAddress, 'Wallet address')}
                >
                  <span className="text-sm font-mono text-white flex-1 select-all">
                    {formatAddress(walletAddress, 8)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyAddress(walletAddress, 'Wallet address');
                    }}
                    className={cn(
                      "h-6 w-6 p-0 transition-all duration-200",
                      isRecentlyCopied(walletAddress)
                        ? "bg-green-400/20 hover:bg-green-400/30 text-green-400"
                        : "hover:bg-teal-card text-white"
                    )}
                  >
                    {isRecentlyCopied(walletAddress) ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Email Address (if available) */}
              {userEmail && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400">
                    Email Address
                  </label>
                  <div
                    className="flex items-center gap-2 p-2 bg-teal-card/50 border border-teal rounded-md cursor-pointer hover:bg-teal-card/70 hover:border-white/10 transition-colors"
                    onClick={() => handleCopyAddress(userEmail, 'Email address')}
                  >
                    <span className="text-sm text-white flex-1 select-all">
                      {userEmail}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyAddress(userEmail, 'Email address');
                      }}
                      className={cn(
                        "h-6 w-6 p-0 transition-all duration-200",
                        isRecentlyCopied(userEmail)
                          ? "bg-green-400/20 hover:bg-green-400/30 text-green-400"
                          : "hover:bg-teal-card text-white"
                      )}
                    >
                      {isRecentlyCopied(userEmail) ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Separator className="bg-teal" />

            {/* Network Info Section */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-slate-400">
                Current Network
              </label>
              <NetworkDisplay
                size="sm"
                showStatusIndicator={false}
                className="w-full"
              />
            </div>

            <Separator className="bg-teal" />

            {/* Action Buttons Section */}
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 border-red-400/30"
              >
                <LogOut className="w-4 h-4" />
                Disconnect Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}