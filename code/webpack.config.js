const archiver = require("archiver");
const externals = require("webpack-node-externals");
const fs = require("fs");
const _ = require("lodash");
const path = require("path");

const CopyPlugin = require("copy-webpack-plugin");
const EventHooksPlugin = require("event-hooks-webpack-plugin");

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Resolve module dependencies recursively
 *
 * @param {string} module - Module path
 *
 * @return {Array<string>} Paths of dependent modules
 */
const resolve = module => {
    const metadata = require(path.resolve(module, "package.json"));
    return _.uniq(Object.keys(metadata.dependencies || {}).reduce(
        (dependencies, name) => {
            const dependency = path.resolve([module, __dirname].find(base => {
                return fs.existsSync(path.resolve(base, "node_modules", name));
            }), "node_modules", name);
            return [...dependencies, dependency, ...resolve(dependency)];
        }, []));
};

/**
 * Automatically resolve entrypoints
 *
 * @param  {string} directory Directory
 *
 * @return {Object} Entrypoints
 */
const entry = directory => {
    const originalDirectory = directory;
    return fs.readdirSync(directory).reduce((entrypoints, file) => {
        if (fs.statSync(`${directory}/${file}`).isDirectory()) {
            return {...entrypoints, ...entry(`${directory}/${file}`)};
        } else {
            const functionName = file.split('.').slice(0, -1).join('.');
            entrypoints[functionName] = path.resolve(directory, file);
        }
        return entrypoints;
    }, {});
};

/* ----------------------------------------------------------------------------
 * Configuration
 * ------------------------------------------------------------------------- */

module.exports = {
    mode: "production",

    target: "node",

    /* Entrypoints */
    entry: entry(path.resolve(__dirname, "src/functions")),

    /* Loaders */
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.ts$/,
                use: "ts-loader",
            }
        ],
    },

    /* Output */
    output: {
        filename: "[name]/index.js",
        libraryTarget: "commonjs2",
        path: path.join(__dirname, "dist"),
        sourceMapFilename: "[name]/index.js.map",
    },

    devtool: "source-map",

    /* Plugins */
    plugins: [

        /* Hack: The webpack development middleware sometimes goes into a loop on
           macOS when starting for the first time. This is a quick fix until
           this issue is resolved. See: http://bit.ly/2AsizEn */
        new EventHooksPlugin({
            done: stats => {
                stats.startTime -= 10000;
            },
            watchRun: (compiler, cb) => {
                compiler.startTime += 10000;
                cb();
            },
        }),

        /* Post-compilation hook to bundle sources with dependencies */
        new EventHooksPlugin({
            done: stats => {
                stats.compilation.entrypoints.forEach(entryPoint => {
                    entryPoint.chunks.forEach(chunk => {

                        /* Create archive for each entrypoint */
                        const archive = archiver("zip", {zlib: {level: 9}});
                        const zipfile = fs.createWriteStream(
                            path.join(__dirname, "dist", `${entryPoint.options.name}.zip`));

                        /* Iterate modules and determine what to package */
                        const externalsLibs = [];
                        chunk.modulesIterable.forEach(module => {
                            module.dependencies.forEach(dependency => {
                                if (!dependency.request) {
                                    return;
                                }

                                let request;
                                /* Extract first part of package */
                                if (dependency.request[0] === "@") {
                                    // sepecial case for all modules that have a namespace
                                    const parts = dependency.request.split(path.sep);
                                    request = parts[0] + path.sep + parts[1];
                                } else {
                                    [request] = dependency.request.split(path.sep);
                                }

                                /* Bundle all non-native modules, except aws-sdk */
                                if (request !== "aws-sdk" && request.match(/^[^.]/)) {
                                    externalsLibs.push(request);
                                }

                                if (request === 'request-promise') {
                                    externalsLibs.push('request');
                                }
                            });
                        });

                        /* Unify dependencies and package into archive */
                        _.uniq(externalsLibs).forEach(module => {
                            const external = path.resolve(
                                __dirname, "node_modules", module);
                            if (fs.existsSync(external)) {
                                archive.directory(external,
                                    path.join("node_modules", module));

                                /* Bundle nested dependencies */
                                resolve(external).forEach(subexternal => {
                                    archive.directory(subexternal,
                                        path.relative(__dirname, subexternal));
                                });
                            }
                        });

                        /* Append compiled sources to archive */
                        archive.directory(path.resolve(__dirname, "dist", entryPoint.options.name), false);

                        /* Finalize and write archive */
                        archive.pipe(zipfile);
                        archive.finalize();
                    });
                });
            },
        }),
    ],

    /* External modules */
    externals: [
        externals(),
],

    /* Disable __dirname, as this will not work on Lambda */
    node: {
        __dirname: false,
    },

    /* Module resolver */
    resolve: {
        extensions: [".ts", ".js"],
        modules: [
            path.resolve(__dirname, "node_modules"),
        ],
    },
};