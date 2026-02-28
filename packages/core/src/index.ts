/**
 * SKALE 8004 TypeScript SDK
 * Main entry point - exports public API
 */

// Export models
export * from './models/index.js';

// Export utilities
export * from './utils/index.js';

// Export core classes
export { SDK } from './core/sdk.js';
export type { SDKConfig } from './core/sdk.js';
export { Agent } from './core/agent.js';
export { ViemChainClient } from './core/viem-chain-client.js';
export type { ChainClient, TransactionOptions, Hex } from './core/chain-client.js';
export { IPFSClient } from './core/ipfs-client.js';
export type { IPFSClientConfig } from './core/ipfs-client.js';
export { SubgraphClient } from './core/subgraph-client.js';
export { FeedbackManager } from './core/feedback-manager.js';
export { EndpointCrawler } from './core/endpoint-crawler.js';
export type { McpCapabilities, A2aCapabilities } from './core/endpoint-crawler.js';
export { AgentIndexer } from './core/indexer.js';
export { TransactionHandle } from './core/transaction-handle.js';
export type { TransactionMined, TransactionWaitOptions } from './core/transaction-handle.js';
/**
 * Legacy compatibility export.
 * Prefer `SDK` directly in new code.
 */
export class Agent0 {
  private readonly client: Pick<import("./core/chain-client.js").ChainClient, "chainId">;

  public constructor(client: Pick<import("./core/chain-client.js").ChainClient, "chainId">) {
    this.client = client;
  }

  public get chain(): string {
    return String(this.client.chainId);
  }

  public async balanceOf(_address: `0x${string}`): Promise<bigint> {
    return 0n;
  }
}

// Export contract definitions
export * from './core/contracts.js';

