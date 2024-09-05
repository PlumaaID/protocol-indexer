import { createConfig } from "@ponder/core";
import { http } from "viem";
import { erc721ABI } from "./abis/erc721ABI";
import { AccessControlledOffchainAggregator } from "./abis/chainlink/AccessControlledOffchainAggregator";

export default createConfig({
  networks: {
    arbitrum: {
      chainId: 42161,
      transport: http(process.env.PONDER_RPC_URL_42161),
    },
    "arbitrum-sepolia": {
      chainId: 421614,
      transport: http(process.env.PONDER_RPC_URL_421614),
    },
    polygon: {
      chainId: 56,
      transport: http(process.env.PONDER_RPC_URL_137),
    },
  },
  contracts: {
    Endorser: {
      abi: erc721ABI,
      address: "0x0000c908D1104caD2867Ec2A8Bb178D78C9bAaaa",
      filter: {
        event: "Transfer",
      },
      network: {
        "arbitrum-sepolia": {
          startBlock: 72138379,
        },
        arbitrum: {
          startBlock: 244339084,
        },
      },
    },
    MXNUSDFeed: {
      abi: AccessControlledOffchainAggregator,
      network: "polygon",
      address: "0x3D9b02dba75AfDa94F973F537A7f058f5788eDE6",
      filter: {
        event: "AnswerUpdated",
      },
      startBlock: 20144664,
    },
    USDCUSDFeed: {
      abi: AccessControlledOffchainAggregator,
      network: "arbitrum",
      filter: {
        event: "AnswerUpdated",
      },
      address: "0x2946220288DbBF77dF0030fCecc2a8348CbBE32C",
    },
  },
});
