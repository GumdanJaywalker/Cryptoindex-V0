import { PrivyProvider, PrivyClientConfig } from '@privy-io/react-auth';

// Privy configuration
export const privyConfig: PrivyClientConfig = {
  // Your actual Privy App ID
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cmcvc4ho5009rky0nfr3cgnms',
  
  // Configure supported login methods
  loginMethods: ['email', 'wallet'],
  
  // Email configuration
  emailConfig: {
    enableEmailLogin: true,
    // Allow any email domain (remove if you want specific domains)
    allowedDomains: undefined,
  },
  
  // Configure supported wallets
  supportedChains: [
    // Add your supported chains here
  ],
  
  // Configure appearance
  appearance: {
    theme: 'light',
    accentColor: '#676FFF',
    logo: 'https://your-logo-url.com/logo.png',
  },
  
  // Configure embedded wallet
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    noPromptOnSignature: false,
  },
  
  // Configure MFA
  mfa: {
    noPromptOnMfaRequired: false,
  },
};

// Custom hook for Supabase integration
import { usePrivy } from '@privy-io/react-auth';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useSupabaseWithPrivy() {
  const { ready, authenticated, user, getAccessToken } = usePrivy();
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null);

  useEffect(() => {
    if (ready && authenticated && user) {
      const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          auth: {
            persistSession: false,
          },
          global: {
            headers: {
              'x-privy-user-id': user.id,
            },
          },
        }
      );

      setSupabase(supabaseClient);
    }
  }, [ready, authenticated, user]);

  const createOrUpdateUser = async () => {
    if (!user) return null;

    try {
      // Call the server-side API to sync user data
      const response = await fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          privyUser: user // Send the full Privy user object
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error syncing user:', errorData);
        return null;
      }

      const result = await response.json();
      return result.user;
    } catch (error) {
      console.error('Error in createOrUpdateUser:', error);
      return null;
    }
  };

  return {
    supabase,
    user,
    authenticated,
    ready,
    createOrUpdateUser,
    getAccessToken,
  };
}