import { getAddress, hashTypedData, type Hex } from "viem";

export const SKALE_BASE_CHAIN_ID = 1187947933;
export const SKALE_BASE_SEPOLIA_CHAIN_ID = 324705682;

export type RelayIntentInput = {
  chainId: typeof SKALE_BASE_CHAIN_ID | typeof SKALE_BASE_SEPOLIA_CHAIN_ID;
  user: Hex;
  to: Hex;
  data: Hex;
  value?: string;
  nonce: string;
  expiresAt: number;
  operationId: string;
};

export type RelayIntentPayload = RelayIntentInput & {
  value: string;
  signature: Hex;
};

export type SignTypedDataFn = (args: {
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: Hex;
  };
  types: {
    RelayIntent: readonly {
      name: string;
      type: string;
    }[];
  };
  primaryType: "RelayIntent";
  message: {
    user: Hex;
    to: Hex;
    data: Hex;
    value: bigint;
    nonce: string;
    expiresAt: bigint;
    operationId: string;
  };
}) => Promise<Hex>;

const relayIntentTypes = {
  RelayIntent: [
    { name: "user", type: "address" },
    { name: "to", type: "address" },
    { name: "data", type: "bytes" },
    { name: "value", type: "uint256" },
    { name: "nonce", type: "string" },
    { name: "expiresAt", type: "uint256" },
    { name: "operationId", type: "string" }
  ] as const
} as const;

export class SkaleX402ProxyClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;

  public constructor(config: {
    baseUrl: string;
    defaultHeaders?: Record<string, string>;
  }) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.defaultHeaders = config.defaultHeaders ?? {};
  }

  public async signIntent(
    input: RelayIntentInput,
    signTypedData: SignTypedDataFn
  ): Promise<RelayIntentPayload> {
    const message = {
      user: getAddress(input.user),
      to: getAddress(input.to),
      data: input.data,
      value: BigInt(input.value ?? "0"),
      nonce: input.nonce,
      expiresAt: BigInt(input.expiresAt),
      operationId: input.operationId
    };

    const signature = await signTypedData({
      domain: {
        name: "ERC8004ProxyService",
        version: "1",
        chainId: input.chainId,
        verifyingContract: getAddress(input.to)
      },
      types: relayIntentTypes,
      primaryType: "RelayIntent",
      message
    });

    return {
      ...input,
      value: input.value ?? "0",
      signature
    };
  }

  public async executeRelay(
    payload: RelayIntentPayload
  ): Promise<{ txHash: Hex; chainId: number; executionHash: Hex }> {
    const response = await fetch(`${this.baseUrl}/v1/erc8004/execute`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...this.defaultHeaders
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`relay_request_failed:${response.status}:${body}`);
    }

    const data = (await response.json()) as {
      txHash: Hex;
      chainId: number;
      executionHash: Hex;
    };
    return data;
  }

  public static intentDigest(input: RelayIntentInput): Hex {
    return hashTypedData({
      domain: {
        name: "ERC8004ProxyService",
        version: "1",
        chainId: input.chainId,
        verifyingContract: getAddress(input.to)
      },
      types: relayIntentTypes,
      primaryType: "RelayIntent",
      message: {
        user: getAddress(input.user),
        to: getAddress(input.to),
        data: input.data,
        value: BigInt(input.value ?? "0"),
        nonce: input.nonce,
        expiresAt: BigInt(input.expiresAt),
        operationId: input.operationId
      }
    });
  }
}
