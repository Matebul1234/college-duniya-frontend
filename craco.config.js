const path = require("path");

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.output.path = path.resolve(__dirname, "dist");
            return webpackConfig;
        },
    },
};
