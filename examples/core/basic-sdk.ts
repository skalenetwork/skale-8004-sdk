import { SDK, encodeReputationValue, parseAgentId } from "@skalenetwork/8004";

async function run() {
  const sdk = new SDK({
    chainId: 11155111,
    rpcUrl: "https://rpc.ankr.com/eth_sepolia"
  });

  const encoded = encodeReputationValue("1.25");
  const parsed = parseAgentId("11155111:42");

  console.log("SDK ready:", { readOnly: sdk.isReadOnly, chain: await sdk.chainId() });
  console.log("Encoded reputation:", encoded);
  console.log("Parsed agent id:", parsed);
}

void run();
