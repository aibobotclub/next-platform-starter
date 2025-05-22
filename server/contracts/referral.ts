import { createPublicClient, http } from 'viem'
import { mainnet, sepolia } from 'wagmi/chains'
import { AIDA_REFERRAL_ABI } from "@/constants/abis";
import { AIDA_REFERRAL_ADDRESS } from "@/constants/addresses";
import { serverWallet } from "../thirdweb";

// Create public client
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
})

// Register user
export async function registerUser(userAddress: string) {
  const response = await fetch(
    "https://engine-cloud-dev-l8wt.chainsaw-dev.zeet.app/v1/write/contract",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-secret-key": process.env.ENGINE_SECRET_KEY || "",
        "x-vault-access-token": process.env.ENGINE_VAULT_ACCESS_TOKEN || "",
      },
      body: JSON.stringify({
        executionOptions: {
          from: serverWallet.address,
          chainId: mainnet.id.toString(),
        },
        params: [
          {
            contractAddress: AIDA_REFERRAL_ADDRESS,
            method: "function registerUser(address user)",
            params: [userAddress],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to register user');
  }

  return await response.json();
}

// Bind referral relationship
export async function bindReferral(referrer: string, referee: string) {
  const response = await fetch(
    "https://engine-cloud-dev-l8wt.chainsaw-dev.zeet.app/v1/write/contract",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-secret-key": process.env.ENGINE_SECRET_KEY || "",
        "x-vault-access-token": process.env.ENGINE_VAULT_ACCESS_TOKEN || "",
      },
      body: JSON.stringify({
        executionOptions: {
          from: serverWallet.address,
          chainId: mainnet.id.toString(),
        },
        params: [
          {
            contractAddress: AIDA_REFERRAL_ADDRESS,
            method: "function bindReferral(address referrer, address referee)",
            params: [referrer, referee],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to bind referral relationship');
  }

  return await response.json();
}

// Get user registration status
export async function isUserRegistered(userAddress: string) {
  try {
    return await publicClient.readContract({
      address: AIDA_REFERRAL_ADDRESS,
      abi: AIDA_REFERRAL_ABI,
      functionName: 'isUserRegistered',
      args: [userAddress]
    });
  } catch (error) {
    console.error('Failed to get user registration status:', error);
    throw new Error('Failed to get user registration status');
  }
}

// Get referrer address
export async function getReferrer(userAddress: string) {
  try {
    return await publicClient.readContract({
      address: AIDA_REFERRAL_ADDRESS,
      abi: AIDA_REFERRAL_ABI,
      functionName: 'getReferrer',
      args: [userAddress]
    });
  } catch (error) {
    console.error('Failed to get referrer address:', error);
    throw new Error('Failed to get referrer address');
  }
}

// Get referral path
export async function getReferralPath(userAddress: string) {
  try {
    return await publicClient.readContract({
      address: AIDA_REFERRAL_ADDRESS,
      abi: AIDA_REFERRAL_ABI,
      functionName: 'getReferralPath',
      args: [userAddress]
    });
  } catch (error) {
    console.error('Failed to get referral path:', error);
    throw new Error('Failed to get referral path');
  }
} 