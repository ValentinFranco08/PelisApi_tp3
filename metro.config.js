const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const appDirectory = path.join(projectRoot, "app");
const expoRouterCtxDir = path.dirname(require.resolve("expo-router/_ctx.web.js"));
let relativeAppPath = path.relative(expoRouterCtxDir, appDirectory).replace(/\\/g, "/");
if (!relativeAppPath.startsWith(".")) {
  relativeAppPath = `./${relativeAppPath}`;
}

const config = getDefaultConfig(projectRoot);
const { assetExts, sourceExts } = config.resolver;

config.server = config.server || {};
const originalEnhanceMiddleware = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (middleware) => {
  const nextMiddleware = originalEnhanceMiddleware ? originalEnhanceMiddleware(middleware) : middleware;
  return (req, res, next) => {
    if (!process.env.EXPO_ROUTER_APP_ROOT) {
      process.env.EXPO_ROUTER_APP_ROOT = relativeAppPath;
    }
    return nextMiddleware(req, res, next);
  };
};

if (!assetExts.includes("wasm")) {
  assetExts.push("wasm");
}
config.resolver.sourceExts = sourceExts.filter((ext) => ext !== "wasm");

module.exports = config;
