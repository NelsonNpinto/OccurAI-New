const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg');
defaultConfig.resolver.sourceExts.push('svg');
defaultConfig.transformer = {
  ...defaultConfig.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

const baseConfig = mergeConfig(defaultConfig, {});

// ✅ Apply NativeWind first, then wrap it with Reanimated
const withNativeWindConfig = withNativeWind(baseConfig, { input: './global.css' });
const finalConfig = wrapWithReanimatedMetroConfig(withNativeWindConfig);

module.exports = finalConfig;
