module.exports = (api) => {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: [
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          root: ['.'],
          alias: {
            // 'app/...' resolves to the expo app root (self-referential)
            app: '.',
            '@my/ui': './ui',
            '@my/config': './config',
          },
          extensions: ['.js', '.jsx', '.tsx', '.ts', '.ios.js', '.android.js'],
        },
      ],
      ...(process.env.EAS_BUILD_PLATFORM === 'android'
        ? []
        : [
            [
              '@tamagui/babel-plugin',
              {
                components: ['@my/ui', 'tamagui'],
                config: './config/tamagui.config.ts',
                logTimings: true,
                disableExtraction: process.env.NODE_ENV === 'development',
              },
            ],
          ]),
      ['transform-inline-environment-variables', {
        include: ['TAMAGUI_USE_NATIVE_PORTAL'],
      }],
    ],
  }
}
