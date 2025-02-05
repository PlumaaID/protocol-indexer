import { createConfig, loadBalance, factory } from "ponder";
import { getAbiItem, http } from "viem";
import { erc721ABI } from "./abis/erc721ABI";
import { AccessControlledOffchainAggregator } from "./abis/chainlink/AccessControlledOffchainAggregator";
import { TinteroLoanABI } from "./abis/tintero/loan";
import { TinteroVaultABI } from "./abis/tintero/vault";

export default createConfig({
  networks: {
    arbitrum: {
      chainId: 42161,
      transport: loadBalance([
        http(
          `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
        ),
      ]),
    },
    "arbitrum-sepolia": {
      chainId: 421614,
      transport: loadBalance([
        http(
          `https://arb-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
        ),
      ]),
    },
    polygon: {
      chainId: 137,
      transport: loadBalance([
        http(
          `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
        ),
      ]),
    },
  },
  contracts: {
    TinteroVaultUSDC: {
      abi: TinteroVaultABI,
      network: {
        "arbitrum-sepolia": {
          startBlock: 120219065,
          address: "0xa5c0a11fc265f3cddb0624f73f955a3c71bad754",
        },
      },
    },
    TinteroLoanUSDC: {
      abi: TinteroLoanABI,
      network: {
        "arbitrum-sepolia": {
          startBlock: 120219065,
          address: factory({
            address: "0xa5c0a11fc265f3cddb0624f73f955a3c71bad754",
            event: getAbiItem({ abi: TinteroVaultABI, name: "LoanCreated" }),
            parameter: "loan",
          }),
        },
      },
    },
    Endorser: {
      abi: erc721ABI,
      network: {
        "arbitrum-sepolia": {
          startBlock: 72138379,
          address: "0x0000c908D1104caD2867Ec2A8Bb178D78C9bAaaa",
        },
        arbitrum: {
          startBlock: 244339084,
          address: "0x0000c908D1104caD2867Ec2A8Bb178D78C9bAaaa",
        },
      },
    },
    MXNUSDFeed: {
      abi: AccessControlledOffchainAggregator,
      network: "polygon",
      address: "0x3D9b02dba75AfDa94F973F537A7f058f5788eDE6",
      startBlock: 20144664,
    },
    USDCUSDFeed: {
      abi: AccessControlledOffchainAggregator,
      network: "arbitrum",

      address: "0x2946220288DbBF77dF0030fCecc2a8348CbBE32C",
      startBlock: 101203,
    },
  },
});
