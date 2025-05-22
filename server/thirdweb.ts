import { Engine } from "thirdweb";
import { createThirdwebClient } from "thirdweb";

// Check required environment variables
const THIRDWEB_SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;
const SERVER_WALLET_ADDRESS = process.env.SERVER_WALLET_ADDRESS;
const VAULT_ACCESS_TOKEN = process.env.VAULT_ACCESS_TOKEN;

// Validate environment variables
if (!THIRDWEB_SECRET_KEY) throw new Error('Missing required environment variable: THIRDWEB_SECRET_KEY');
if (!SERVER_WALLET_ADDRESS) throw new Error('Missing required environment variable: SERVER_WALLET_ADDRESS');
if (!VAULT_ACCESS_TOKEN) throw new Error('Missing required environment variable: VAULT_ACCESS_TOKEN');

// Create Thirdweb client
export const client = createThirdwebClient({
  secretKey: THIRDWEB_SECRET_KEY,
});

// Create server wallet instance
export const serverWallet = Engine.serverWallet({
  client,
  address: SERVER_WALLET_ADDRESS as `0x${string}`,
  vaultAccessToken: VAULT_ACCESS_TOKEN,
}); 