import { createConfig, loadBalance, rateLimit } from "@ponder/core";
import { http } from "viem";
import { erc721ABI } from "./abis/erc721ABI";
import { AccessControlledOffchainAggregator } from "./abis/chainlink/AccessControlledOffchainAggregator";

export default createConfig({
  networks: {
    arbitrum: {
      chainId: 42161,
      transport: loadBalance([
        http(
          `https://arbitrum-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
        ),
        rateLimit(http("https://rpc.ankr.com/arbitrum"), {
          requestsPerSecond: 5,
        }),
      ]),
    },
    "arbitrum-sepolia": {
      chainId: 421614,
      transport: loadBalance([
        http(
          `https://arbitrum-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
        ),
        rateLimit(http("https://sepolia-rollup.arbitrum.io/rpc"), {
          requestsPerSecond: 5,
        }),
      ]),
    },
    polygon: {
      chainId: 137,
      transport: loadBalance([
        http(
          `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
        ),
        rateLimit(http("https://rpc.ankr.com/polygon"), {
          requestsPerSecond: 5,
        }),
      ]),
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
      startBlock: 101203,
    },
  },
});
