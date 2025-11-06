const path = require("path");
require("dotenv").config();

const projectRoot = __dirname;
const appDirectory = path.join(projectRoot, "app");
const expoRouterCtxDir = path.dirname(require.resolve("expo-router/_ctx.web.js"));
let relativeAppPath = path.relative(expoRouterCtxDir, appDirectory).replace(/\\/g, "/");
if (!relativeAppPath.startsWith(".")) {
  relativeAppPath = `./${relativeAppPath}`;
}
process.env.EXPO_ROUTER_APP_ROOT = relativeAppPath;
process.env.TAMAGUI_TARGET = process.env.TAMAGUI_TARGET || "native";

module.exports = {
  expo: {
    name: "My-App",
    slug: "my-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    scheme: "pelisapp",
    plugins: ["expo-router", "expo-sqlite"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      EXPO_PUBLIC_TMDB_API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY,
    },
  },
};
