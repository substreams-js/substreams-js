export const featured: FeaturedPackage[] = [
  {
    id: "uniswap-v3",
    name: "Uniswap v3",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.",
    github: "https://github.com/streamingfast/substreams-uniswap-v3/blob/develop/substreams.yaml",
    version: "v0.2.8",
    spkg: "https://github.com/streamingfast/substreams-uniswap-v3/releases/download/v0.2.8/substreams.spkg",
  },
  {
    id: "erc-20",
    name: "ERC-20",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.",
    github: "https://github.com/pinax-network/substreams-cookbook/tree/main/erc20/substreams.yaml",
    version: "v0.3.0",
    spkg: "https://github.com/pinax-network/substreams-cookbook/releases/download/erc20-v0.3.0/erc20-v0.3.0.spkg",
  },
  {
    id: "eth-block-meta",
    name: "Block Metadata",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.",
    github: "https://github.com/streamingfast/substreams-eth-block-meta/blob/master/substreams.yaml",
    version: "v0.5.1",
    spkg: "https://github.com/streamingfast/substreams-eth-block-meta/releases/download/v0.5.1/substreams-eth-block-meta-v0.5.1.spkg",
  },
];

export type FeaturedPackage = {
  id: string;
  name: string;
  description: string;
  github: string;
  version: string;
  spkg: string;
};
