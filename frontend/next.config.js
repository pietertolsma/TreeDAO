module.exports = {
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, process: false, path: false, os: false };
    return config;
  },
  env: {
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    ALCHEMY_API_URL: process.env.ALCHEMY_API_URL,
    WALLET_ADDRESS: process.env.WALLET_ADDRESS,
  }
};
