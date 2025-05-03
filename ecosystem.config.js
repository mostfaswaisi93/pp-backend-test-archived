module.exports = {
  apps: [
    {
      name: "peakproz-backend",
      script: "node_modules/ts-node/dist/bin.js",
      args: "src/index.ts",
      watch: true,
      interpreter: "node",
      interpreter_args: "--require ts-node/register",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
