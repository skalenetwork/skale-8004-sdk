import type { ChainClient, Hex } from "@skalenetwork/8004";

export interface EthersV6LikeProvider {
  getNetwork(): Promise<{ chainId: bigint; name?: string }>;
  getBalance(address: string): Promise<bigint>;
}

export function createEthersAdapter(provider: EthersV6LikeProvider): ChainClient {
  return {
    name: "ethers",
    async getChainId() {
      const network = await provider.getNetwork();
      return Number(network.chainId);
    },
    async getBalance(address: Hex) {
      return provider.getBalance(address);
    }
  } as unknown as ChainClient;
}
