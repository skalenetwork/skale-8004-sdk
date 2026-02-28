#!/usr/bin/env node
import { Agent0, parseAgentId } from "@skalenetwork/8004";
import { Command } from "commander";

const program = new Command();
const mockClient = { chainId: 31337 as const };
const sdkCompat = new Agent0(mockClient);
const version = "0.1.0";

async function main() {
  program
    .name("skale8004")
    .description("SKALE 8004 CLI")
    .version(version);

  program
    .command("chain")
    .description("print current chain identifier")
    .action(() => {
      process.stdout.write(`${sdkCompat.chain}\n`);
    });

  program
    .command("balance")
    .description("query a mock compatibility balance value")
    .argument("<address>", "0x-prefixed wallet address")
    .action(async (address: string) => {
      if (!address.startsWith("0x")) {
        throw new Error("address must be 0x-prefixed");
      }
      const value = await sdkCompat.balanceOf(address as `0x${string}`);
      process.stdout.write(`${value.toString()}\n`);
    });

  program
    .command("parse-agent-id")
    .description('parse "chainId:tokenId" into parts')
    .argument("<agentId>", 'formatted as "chainId:tokenId"')
    .action((agentId: string) => {
      const parsed = parseAgentId(agentId);
      process.stdout.write(`${JSON.stringify(parsed, null, 2)}\n`);
    });

  await program.parseAsync(process.argv);
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Error: ${message}\n`);
  process.exitCode = 1;
});
