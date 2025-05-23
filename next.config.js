const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config, { dev, isServer }) => {
        // 优化 CSS 处理
        if (!dev && !isServer) {
            config.optimization.minimizer.push(
                new CssMinimizerPlugin({
                    minimizerOptions: {
                        preset: [
                            'default',
                            {
                                discardComments: { removeAll: true },
                            },
                        ],
                    },
                })
            );
        }
        return config;
    },
    experimental: {
        css: {
            // 禁用 lightningcss，回退到 postcss
            implementation: require('postcss'),
        },
    },
};

module.exports = nextConfig;
