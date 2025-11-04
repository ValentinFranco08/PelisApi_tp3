import "dotenv/config";

export default {
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
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    scheme: "pelisapp",
    plugins: ["expo-sqlite"],
    extra: {
      // Expo expone esta variable en process.env.EXPO_PUBLIC_TMDB_API_KEY dentro del bundle
      EXPO_PUBLIC_TMDB_API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY,
    }
  }
};
