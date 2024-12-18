const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    plugins: [],
    webpack: {
        alias: {},
        plugins: [],
        configure: (webpackConfig, { env, paths }) => {
            if (!webpackConfig.plugins) {
                webpackConfig.plugins = [];
            }

            webpackConfig.plugins.push(
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: 'node_modules/@microsoft/signalr/dist/browser/signalr.min.js'
                        },
                        {
                            from: 'node_modules/abp-web-resources/Abp/Framework/scripts/libs/abp.signalr-client.js',
                            to: process.env.NODE_ENV === 'production' ? 'dist/abp.signalr-client.js' : undefined
                        },
                        {
                            from: 'src/lib/abp.js'
                        }
                    ]
                })
            );

            return webpackConfig;
        }
    }
};
