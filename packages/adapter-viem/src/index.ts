import type { ChainClient, Hex } from "@skalenetwork/8004";

export interface ViemLikeClient {
  chain?: { id: number; name?: string };
  getBalance(args: { address: Hex }): Promise<bigint>;
}

export function createViemAdapter(client: ViemLikeClient): ChainClient {
  return {
    name: client.chain?.name ?? "viem",
    async getChainId() {
      return client.chain?.id ?? 0;
    },
    async getBalance(address: Hex) {
      return client.getBalance({ address });
    }
  } as unknown as ChainClient;
}
