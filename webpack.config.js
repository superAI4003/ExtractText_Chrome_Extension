const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require('dotenv-webpack');

module.exports = {
    // Entry points for the application
    entry: {
        index: "./src/index.tsx", // Main entry point for the app
        background: "./background.js" // Entry point for background scripts
    },
    mode: "production", // Set the mode to production for optimized builds
    module: {
        rules: [
            {
                // Rule for TypeScript files
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: { noEmit: false }, // Allow emitting files
                        }
                    }
                ],
                exclude: /node_modules/, // Exclude node_modules from processing
            },
            {
                // Rule for CSS files
                exclude: /node_modules/,
                test: /\.css$/i,
                use: [
                    "style-loader", // Injects styles into DOM
                    "css-loader", // Interprets @import and url() like import/require()
                    'postcss-loader', // Processes CSS with PostCSS
                ]
            },
        ],
    },
    plugins: [
        // Plugin to copy files to the output directory
        new CopyPlugin({
            patterns: [
                { from: "manifest.json", to: "../manifest.json" }, // Copy manifest.json
            ],
        }),
        new Dotenv(), // Load environment variables from .env file
        ...getHtmlPlugins(["index"]), // Generate HTML files for each entry point
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"], // Resolve these extensions
    },
    output: {
        path: path.join(__dirname, "dist/js"), // Output directory for bundled files
        filename: "[name].js", // Output filename pattern
    },
    devServer: {
        static: path.join(__dirname, 'dist'), // Serve static files from 'dist'
        compress: true, // Enable gzip compression
        port: 3000, // Port for the dev server
        open: true, // Open the browser after server starts
    },
};

// Function to generate HTML plugins for each chunk
function getHtmlPlugins(chunks) {
    return chunks.map(
        (chunk) =>
            new HTMLPlugin({
                title: "React extension", // Title for the HTML page
                filename: `${chunk}.html`, // Output filename for HTML
                chunks: [chunk], // Include only the specified chunk
            })
    );
}