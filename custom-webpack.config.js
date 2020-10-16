// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const path = require('path');

module.exports =  {
        entry: './server.ts',
        target: "node",
        output: {
            libraryTarget: "commonjs2"
        },
        optimization: {
            minimize: false
        },
        node: {
            __dirname: true,
            child_process: 'empty',
            fs: 'empty',
            crypto: 'empty',
        },
        module: {
            rules: [
                {
                    // For node binary relocations, include ".node" files as well here
                    test: /\.(m?js|node)$/,
                    // it is recommended for Node builds to turn off AMD support
                    parser: { amd: false },
                    use: {
                        loader: '@zeit/webpack-asset-relocator-loader',
                        options: {
                            // optional, base folder for asset emission (eg assets/name.ext)
                            //outputAssetBase: '../../protos',
                            // optional, restrict asset emissions to only the given folder.
                            filterAssetBase: process.cwd(),
                            // optional, permit entire __dirname emission
                            // eg `const nonAnalyzable = __dirname` can emit everything in the folder
                            emitDirnameAll: false,
                            // optional, permit entire filterAssetBase emission
                            // eg `const nonAnalyzable = process.cwd()` can emit everything in the cwd()
                            emitFilterAssetBaseAll: false,
                            // optional, a list of asset names already emitted or
                            // defined that should not be emitted
                            existingAssetNames: [],
                            wrapperCompatibility: false, // optional, default
                            // build for process.env.NODE_ENV = 'production'
                            production: true, // optional, default is undefined
                            // cwd: process.cwd(), // optional, default
                            debugLog: true, // optional, default
                        }
                    }
                }
            ]
        }
    }
;
