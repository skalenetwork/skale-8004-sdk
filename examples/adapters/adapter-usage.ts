import { createEthersAdapter } from "@skalenetwork/8004-adapter-ethers";
import { createViemAdapter } from "@skalenetwork/8004-adapter-viem";
import { createWeb3Adapter } from "@skalenetwork/8004-adapter-web3";

async function run() {
  const viem = createViemAdapter({
    chain: { id: 11155111, name: "sepolia" },
    async getBalance() {
      return 0n;
    }
  });

  const ethers = createEthersAdapter({
    async getNetwork() {
      return { chainId: 11155111n, name: "sepolia" };
    },
    async getBalance() {
      return 0n;
    }
  });

  const web3 = createWeb3Adapter({
    eth: {
      async getChainId() {
        return 11155111;
      },
      async getBalance() {
        return "0";
      }
    }
  });

  console.log("adapter chain ids:", await viem.getChainId(), await ethers.getChainId(), await web3.getChainId());
}

void run();
