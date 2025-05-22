export const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "Log",
    type: "event",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "ping",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const stringAbi = JSON.stringify(abi);

export const contractAddress = "0x1BaAEFCf459c103364e21166AbEd5FfA86874515";

//  {anonymous:false,inputs:[{indexed:false,internalType:"string",name:"message",type:"string",},],name:"Log",type:"event",},{inputs:[],name:"initialize",outputs:[],stateMutability:"payable",type:"function",},{inputs: [],name:"ping",outputs:[],stateMutability:"nonpayable",type:function",}
