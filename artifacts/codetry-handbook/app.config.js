const baseUrl = process.env.EXPO_PUBLIC_BASE_URL || undefined;

module.exports = {
  expo: {
    name: "Headwaters: How a Community Runs Its Own Economy",
    slug: "codetry-handbook",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "codetry-handbook",
    platforms: ["ios", "android", "web"],
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/icon.png",
      resizeMode: "contain",
      backgroundColor: "#f4ede0",
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: "ca.codetry.handbook",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: "ca.codetry.handbook",
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#f4ede0",
      },
    },
    web: {
      bundler: "metro",
      favicon: "./assets/images/icon.png",
      name: "Headwaters: How a Community Runs Its Own Economy",
      shortName: "Headwaters",
      themeColor: "#1f3d2e",
      backgroundColor: "#f4ede0",
      display: "standalone",
      orientation: "portrait",
      lang: "en",
    },
    plugins: [
      [
        "expo-router",
        {
          origin: "https://replit.com/",
        },
      ],
      "expo-font",
      "expo-web-browser",
      [
        "expo-media-library",
        {
          photosPermission: "Allow $(PRODUCT_NAME) to save your keepsake story to your photo library.",
          savePhotosPermission: "Allow $(PRODUCT_NAME) to save your keepsake story to your photo library.",
          isAccessMediaLocationEnabled: false,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
      ...(baseUrl ? { baseUrl } : {}),
    },
    extra: {
      eas: {
        projectId:
          process.env.EAS_PROJECT_ID || "ccfff076-0500-4aa5-be7d-2d71e7953ad2",
      },
    },
    owner: "headwaters7",
  },
};
