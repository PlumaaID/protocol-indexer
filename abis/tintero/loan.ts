export const TinteroLoanABI = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "UPGRADE_INTERFACE_VERSION",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "beneficiary",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "collateralAsset",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract ERC721Burnable",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "collateralId",
    inputs: [
      {
        name: "index",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "currentFundingIndex",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "currentPaymentIndex",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "currentTrancheIndex",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "defaultThreshold",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "fundN",
    inputs: [
      {
        name: "n",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "totalPrincipal",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      {
        name: "liquidityProvider_",
        type: "address",
        internalType: "address",
      },
      {
        name: "collateralAsset_",
        type: "address",
        internalType: "address",
      },
      {
        name: "beneficiary_",
        type: "address",
        internalType: "address",
      },
      {
        name: "defaultThreshold_",
        type: "uint24",
        internalType: "uint24",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "lendingAsset",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IERC20",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "liquidityProvider",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract ITinteroVault",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "payment",
    inputs: [
      {
        name: "index",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct PaymentLib.Payment",
        components: [
          {
            name: "principal",
            type: "uint96",
            internalType: "uint96",
          },
          {
            name: "fundedAt",
            type: "uint48",
            internalType: "uint48",
          },
          {
            name: "maturityPeriod",
            type: "uint32",
            internalType: "uint32",
          },
          {
            name: "gracePeriod",
            type: "uint32",
            internalType: "uint32",
          },
          {
            name: "interestRate",
            type: "uint24",
            internalType: "uint24",
          },
          {
            name: "premiumRate",
            type: "uint24",
            internalType: "uint24",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proxiableUUID",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pushPayments",
    inputs: [
      {
        name: "collateralTokenIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "payment_",
        type: "tuple[]",
        internalType: "struct PaymentLib.Payment[]",
        components: [
          {
            name: "principal",
            type: "uint96",
            internalType: "uint96",
          },
          {
            name: "fundedAt",
            type: "uint48",
            internalType: "uint48",
          },
          {
            name: "maturityPeriod",
            type: "uint32",
            internalType: "uint32",
          },
          {
            name: "gracePeriod",
            type: "uint32",
            internalType: "uint32",
          },
          {
            name: "interestRate",
            type: "uint24",
            internalType: "uint24",
          },
          {
            name: "premiumRate",
            type: "uint24",
            internalType: "uint24",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "principalRequested",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "pushTranches",
    inputs: [
      {
        name: "paymentIndexes",
        type: "uint96[]",
        internalType: "uint96[]",
      },
      {
        name: "recipients",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "repayCurrent",
    inputs: [
      {
        name: "collateralReceiver",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "repayN",
    inputs: [
      {
        name: "n",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "collateralReceiver",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "repossess",
    inputs: [
      {
        name: "start",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "end",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "receiver",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "state",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "enum LoanState",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalPayments",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalTranches",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "tranche",
    inputs: [
      {
        name: "trancheIndex",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "paymentIndex",
        type: "uint96",
        internalType: "uint96",
      },
      {
        name: "recipient",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "upgradeLoan",
    inputs: [
      {
        name: "newImplementation",
        type: "address",
        internalType: "address",
      },
      {
        name: "data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "upgradeToAndCall",
    inputs: [
      {
        name: "newImplementation",
        type: "address",
        internalType: "address",
      },
      {
        name: "data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "withdrawPaymentCollateral",
    inputs: [
      {
        name: "start",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "end",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      {
        name: "version",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PaymentCreated",
    inputs: [
      {
        name: "index",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "tokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "payment",
        type: "tuple",
        indexed: false,
        internalType: "struct PaymentLib.Payment",
        components: [
          {
            name: "principal",
            type: "uint96",
            internalType: "uint96",
          },
          {
            name: "fundedAt",
            type: "uint48",
            internalType: "uint48",
          },
          {
            name: "maturityPeriod",
            type: "uint32",
            internalType: "uint32",
          },
          {
            name: "gracePeriod",
            type: "uint32",
            internalType: "uint32",
          },
          {
            name: "interestRate",
            type: "uint24",
            internalType: "uint24",
          },
          {
            name: "premiumRate",
            type: "uint24",
            internalType: "uint24",
          },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PaymentsFunded",
    inputs: [
      {
        name: "startIndex",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "endIndex",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PaymentsRepaid",
    inputs: [
      {
        name: "startIndex",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "endIndex",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PaymentsRepossessed",
    inputs: [
      {
        name: "recipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "startIndex",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "endIndex",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PaymentsWithdrawn",
    inputs: [
      {
        name: "startIndex",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "endIndex",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TrancheCreated",
    inputs: [
      {
        name: "index",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "paymentIndex",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "receiver",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Upgraded",
    inputs: [
      {
        name: "implementation",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AddressEmptyCode",
    inputs: [
      {
        name: "target",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "AddressInsufficientBalance",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "CheckpointUnorderedInsertion",
    inputs: [],
  },
  {
    type: "error",
    name: "DuplicatedCollateral",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "ERC1967InvalidImplementation",
    inputs: [
      {
        name: "implementation",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "ERC1967NonPayable",
    inputs: [],
  },
  {
    type: "error",
    name: "FailedInnerCall",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidBeneficiary",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidInitialization",
    inputs: [],
  },
  {
    type: "error",
    name: "MathOverflowedMulDiv",
    inputs: [],
  },
  {
    type: "error",
    name: "MismatchedPaymentCollateralIds",
    inputs: [],
  },
  {
    type: "error",
    name: "MismatchedTranchePaymentIndexRecipient",
    inputs: [],
  },
  {
    type: "error",
    name: "NotInitializing",
    inputs: [],
  },
  {
    type: "error",
    name: "OnlyBeneficiary",
    inputs: [],
  },
  {
    type: "error",
    name: "OnlyLiquidityProvider",
    inputs: [],
  },
  {
    type: "error",
    name: "PaymentFunded",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "PaymentMatured",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "SafeCastOverflowedUintDowncast",
    inputs: [
      {
        name: "bits",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "value",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "TooManyTranches",
    inputs: [],
  },
  {
    type: "error",
    name: "UUPSUnauthorizedCallContext",
    inputs: [],
  },
  {
    type: "error",
    name: "UUPSUnsupportedProxiableUUID",
    inputs: [
      {
        name: "slot",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
  },
  {
    type: "error",
    name: "UnexpectedLoanState",
    inputs: [
      {
        name: "current",
        type: "uint8",
        internalType: "enum LoanState",
      },
      {
        name: "expectedStates",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
  },
  {
    type: "error",
    name: "UnincreasingTranchePaymentIndex",
    inputs: [],
  },
  {
    type: "error",
    name: "UnorderedPayments",
    inputs: [],
  },
  {
    type: "error",
    name: "UntranchedPayments",
    inputs: [],
  },
] as const;
