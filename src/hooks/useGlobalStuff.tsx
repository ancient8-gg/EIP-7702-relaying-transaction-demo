import { createGlobalState } from "react-use";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { stringAbi } from "../configs/abi";

export const customSepolia = {
  ...sepolia,
  rpcUrls: { default: { http: ["https://1rpc.io/sepolia"] } },
};
export const useGlobalStuff = createGlobalState<{
  eoaClient: ReturnType<typeof createWalletClient>;
  relayerClient: ReturnType<typeof createWalletClient>;
  abi: string;
  contractAddress: `0x${string}`;
  functionName: string;
}>({
  eoaClient: createWalletClient({
    account: privateKeyToAccount(
      "0xb70d3b5f96cd77885864311f739db0d08b7d2852d5cacec65355ef9e0e5edf01"
    ),
    chain: customSepolia,
    transport: http(),
  }),
  relayerClient: createWalletClient({
    account: privateKeyToAccount(
      "0x65677df39f0ee942481352d6aa0a55359e2bc192633872751cb4bba1e033bdcf"
    ),
    chain: customSepolia,
    transport: http(),
  }),
  abi: stringAbi,
  contractAddress: "0x1BaAEFCf459c103364e21166AbEd5FfA86874515",
  functionName: "ping",
});
