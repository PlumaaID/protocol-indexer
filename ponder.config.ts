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
    ERC721: {
      network: "arbitrum-sepolia",
      abi: erc721ABI,
      address: "0x0065313718d91863De3cB78A5C188990A67093Aa",
      startBlock: 59607703,
    },
  },
});
