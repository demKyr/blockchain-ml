module.exports = {
  submitReviewAbi: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "captions",
      outputs: [
        {
          internalType: "string",
          name: "content",
          type: "string",
        },
        {
          internalType: "uint8",
          name: "label",
          type: "uint8",
        },
        {
          internalType: "bool",
          name: "verified",
          type: "bool",
        },
        {
          internalType: "bool",
          name: "goodData",
          type: "bool",
        },
        {
          internalType: "address",
          name: "providerAddr",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
    },
    {
      inputs: [],
      name: "chairperson",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_caption",
          type: "string",
        },
        {
          internalType: "uint8",
          name: "_lbl",
          type: "uint8",
        },
      ],
      name: "addCaption",
      outputs: [],
      stateMutability: "payable",
      type: "function",
      payable: true,
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_idx",
          type: "uint256",
        },
        {
          internalType: "uint8",
          name: "_lbl",
          type: "uint8",
        },
      ],
      name: "reviewCaption",
      outputs: [],
      stateMutability: "payable",
      type: "function",
      payable: true,
    },
    {
      inputs: [],
      name: "getCaptions",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "content",
              type: "string",
            },
            {
              internalType: "uint8",
              name: "label",
              type: "uint8",
            },
            {
              internalType: "uint8[3]",
              name: "Votes",
              type: "uint8[3]",
            },
            {
              internalType: "bool",
              name: "verified",
              type: "bool",
            },
            {
              internalType: "bool",
              name: "goodData",
              type: "bool",
            },
            {
              internalType: "address",
              name: "providerAddr",
              type: "address",
            },
            {
              internalType: "address[]",
              name: "voters",
              type: "address[]",
            },
          ],
          internalType: "struct TwitterReview.Caption[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_idx",
          type: "uint256",
        },
      ],
      name: "getCaption",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "content",
              type: "string",
            },
            {
              internalType: "uint8",
              name: "label",
              type: "uint8",
            },
            {
              internalType: "uint8[3]",
              name: "Votes",
              type: "uint8[3]",
            },
            {
              internalType: "bool",
              name: "verified",
              type: "bool",
            },
            {
              internalType: "bool",
              name: "goodData",
              type: "bool",
            },
            {
              internalType: "address",
              name: "providerAddr",
              type: "address",
            },
            {
              internalType: "address[]",
              name: "voters",
              type: "address[]",
            },
          ],
          internalType: "struct TwitterReview.Caption",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
    },
    {
      inputs: [],
      name: "getCaptionCnt",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_idx",
          type: "uint256",
        },
      ],
      name: "getCaptionText",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
    },
    {
      inputs: [],
      name: "getCaptionTexts",
      outputs: [
        {
          internalType: "string[]",
          name: "",
          type: "string[]",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
    },
  ],
};
