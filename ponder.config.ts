import { createConfig } from "@ponder/core";
import { http } from "viem";
import { erc721ABI } from "./abis/erc721ABI";

export default createConfig({
  networks: {
    "arbitrum-sepolia": {
      chainId: 421614,
      transport: http(process.env.PONDER_RPC_URL_421614),
    },
  },
  contracts: {
    Endorser: {
      network: "arbitrum-sepolia",
      abi: erc721ABI,
      address: "0x007D52Aaf565f34a1267eF54CB9B1C10B5Da9aAa",
      startBlock: 59607703,
    },
  },
});
