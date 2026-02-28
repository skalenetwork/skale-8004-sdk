import type { ChainClient, Hex } from "@skalenetwork/8004";

export interface Web3LikeClient {
  eth: {
    getChainId(): Promise<bigint | number>;
    getBalance(address: string): Promise<bigint | string>;
  };
}

export function createWeb3Adapter(client: Web3LikeClient): ChainClient {
  return {
    name: "web3",
    async getChainId() {
      const chainId = await client.eth.getChainId();
      return typeof chainId === "bigint" ? Number(chainId) : chainId;
    },
    async getBalance(address: Hex) {
      const value = await client.eth.getBalance(address);
      return typeof value === "bigint" ? value : BigInt(value);
    }
  } as unknown as ChainClient;
}
