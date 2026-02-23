//metro.config.js

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Enable package exports resolution (required for socket.io-client / engine.io-parser)
config.resolver.unstable_enablePackageExports = true;

// Prefer browser-compatible builds over Node.js builds
config.resolver.unstable_conditionNames = ['require', 'default', 'browser'];

// Stub out native-only map libraries when bundling for web
const originalResolver = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform === 'web' &&
    (moduleName === 'react-native-maps' ||
      moduleName.startsWith('react-native-maps/') ||
      moduleName === 'react-native-map-clustering' ||
      moduleName.startsWith('react-native-map-clustering/'))
  ) {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'stubs/mapStub.js'),
    };
  }
  if (originalResolver) {
    return originalResolver(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
