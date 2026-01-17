import fs from 'node:fs';
import path from 'node:path';

import {readManifest} from '@modulify/pkg/read';
// @ts-expect-error
import react from '@vitejs/plugin-react';
import {visualizer} from 'rollup-plugin-visualizer';
import {defineConfig, transformWithEsbuild} from 'vite';
import dts from 'vite-plugin-dts';

const external = [
    /^axios/,
    /^bem-cn-lite/,
    /^blueimp-md5/,
    /^d3/,
    /^classnames/,
    /^clipboard-copy/,
    /^colormap/,
    /^copy-to-clipboard/,
    /^dompurify/,
    /^entities/,
    /^hashids/,
    /^highcharts/,
    /^history/,
    /^htmlparser2/,
    /^immutability-helper/,
    /^js-sha1/,
    /^json-fn/,
    /^jsondiffpatch/,
    /^lodash/,
    /^luxon/,
    /^markdown-it/,
    /^moment/,
    /^monaco-editor/,
    /^prop-types/,
    /^quickjs-emscripten/,
    /^qs$/,
    /^querystring$/,
    /^rc-slider/,
    /^react/,
    /^recompose/,
    /^redux/,
    /^reselect/,
    /^resize-observer-polyfill/,
    /^robust-point-in-polygon/,
    /^uuid/,
    /^yup/,
    /^@bem-react\/.*/,
    /^@braintree\/.*/,
    /^@diplodoc\/.*/,
    /^@datalens-tech\/.*/,
    /^@floating-ui\/.*/,
    // Изменяем это правило, чтобы оно не трогало .css и .scss файлы
    /^@gravity-ui\/(?!app-builder)(?!.*\.s?css$).*/,
    /^@reduxjs\/.*/,
    /^@tanstack\/.*/,
];

export default defineConfig({
    optimizeDeps: {
        esbuildOptions: {
            tsconfig: './tsconfig.build.json',
        },
    },
    resolve: {
        alias: [
            {find: /^assets/, replacement: path.join(__dirname, './src/ui/assets')},
            {find: /^components/, replacement: path.join(__dirname, './src/ui/components')},
            {find: /^constants/, replacement: path.join(__dirname, './src/ui/constants')},
            {find: /^datalens/, replacement: path.join(__dirname, './src/ui/datalens')},
            {find: /^hooks/, replacement: path.join(__dirname, './src/ui/hooks')},
            {find: /^i18n/, replacement: path.join(__dirname, './src/i18n')},
            {find: /^libs/, replacement: path.join(__dirname, './src/ui/libs')},
            {find: /^shared/, replacement: path.join(__dirname, './src/shared')},
            {find: /^store/, replacement: path.join(__dirname, './src/ui/store')},
            {find: /^ui/, replacement: path.join(__dirname, './src/ui')},
            {find: /^units/, replacement: path.join(__dirname, './src/ui/units')},
            {find: /^utils/, replacement: path.join(__dirname, './src/ui/utils')},
            {find: 'react', replacement: path.resolve(__dirname, './node_modules/react')},
            {find: 'react-dom', replacement: path.resolve(__dirname, './node_modules/react-dom')},
            {
                find: 'react-redux',
                replacement: path.resolve(__dirname, './node_modules/react-redux'),
            },
            {find: 'redux', replacement: path.resolve(__dirname, './node_modules/redux')},
            {
                find: '~@gravity-ui/uikit',
                replacement: path.resolve(__dirname, './node_modules/@gravity-ui/uikit'),
            },
            {
                find: 'use-sync-external-store/shim',
                replacement: path.resolve(__dirname, './node_modules/use-sync-external-store/shim'),
            },
            {
                find: 'use-sync-external-store',
                replacement: path.resolve(__dirname, './node_modules/use-sync-external-store/shim'),
            },
            {find: 'index', replacement: path.join(__dirname, './src/ui/index')},
            {find: /^~/, replacement: ''},
        ],
    },
    plugins: [
        react(),
        {
            name: 'i18n-translations',
            closeBundle() {
                const __src = path.resolve(__dirname, 'dist/public/build/i18n');
                const __dst = path.resolve(__dirname, 'dist-lib/public/i18n');

                if (fs.existsSync(__src)) {
                    copyFiles(__src, __dst);

                    const files = fs.readdirSync(__dst);
                    const manifest: Record<string, string> = {};

                    files.forEach((name) => {
                        const [, language] = name.match(/^([a-z]{2})\.[a-f0-9]+\.js$/) ?? [];
                        if (language) {
                            manifest[language] = name;
                        }
                    });

                    if (Object.keys(manifest).length > 0) {
                        fs.writeFileSync(
                            path.join(__dst, 'manifest.json'),
                            JSON.stringify(manifest, null, 2),
                            'utf-8',
                        );
                    }
                } else {
                    console.warn(`[copy-i18n] Source folder ${__src} not found.`);
                }
            },
        },
        dts({
            outDir: 'dist-lib',
            tsconfigPath: 'tsconfig.build.json',
            insertTypesEntry: true,
            staticImport: true,
        }),
        ...(process.env.ANALYZE === 'true'
            ? [
                  visualizer({
                      filename: 'dist-lib/report.html',
                      open: true,
                      gzipSize: true,
                      brotliSize: true,
                  }),
              ]
            : []),
        {
            name: 'npm-prerequisites',
            async closeBundle() {
                const manifest = readManifest(__dirname);
                const prepare = (deps: Record<string, string>) => {
                    const keys = Object.keys(deps).filter((name) =>
                        external.some((regex) => regex.test(name)),
                    );

                    return keys.length
                        ? keys
                              .sort()
                              .reduce(
                                  (all, key) => ({...all, [key]: deps[key]}),
                                  {} as Record<string, string>,
                              )
                        : undefined;
                };

                const outDir = path.resolve(__dirname, 'dist-lib');
                if (!fs.existsSync(outDir)) {
                    fs.mkdirSync(outDir, {recursive: true});
                }

                const licensePath = path.resolve(__dirname, 'LICENSE');
                if (fs.existsSync(licensePath)) {
                    fs.copyFileSync(licensePath, path.join(outDir, 'LICENSE'));
                }

                fs.writeFileSync(
                    path.join(outDir, 'package.json'),
                    JSON.stringify(
                        {
                            name: manifest.name,
                            version: manifest.version,
                            description: 'Datalens UI packed as library',
                            author: manifest.author,
                            contributors: manifest.contributors,
                            license: manifest.license,
                            type: 'module',
                            main: './index.js',
                            types: './types/index.d.ts',
                            style: './index.css',
                            dependencies: prepare({
                                ...manifest.dependencies,
                                ...manifest.devDependencies,
                            }),
                            peerDependencies: prepare({
                                ...manifest.peerDependencies,
                            }),
                            optionalDependencies: prepare({
                                ...manifest.optionalDependencies,
                            }),
                        },
                        null,
                        2,
                    ),
                    'utf-8',
                );
            },
        },
        {
            name: 'jsx-in-js',
            enforce: 'pre',
            transform(code, id) {
                if (id.endsWith('.js') && id.includes('src/')) {
                    return transformWithEsbuild(code, id, {
                        loader: 'jsx',
                        format: 'esm',
                    });
                }
                return null;
            },
        },
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/ui/entries/main.tsx'),
            name: 'MyLibrary',
            formats: ['es'],
            fileName: () => 'index.js',
        },
        rollupOptions: {
            external,
            treeshake: false,
            onwarn(warning, handle) {
                const knownProblems = ['CIRCULAR_DEPENDENCY', 'UNUSED_EXTERNAL_IMPORT'];
                if (knownProblems.includes(warning.code as string)) return;
                if (warning.message.includes('externalized for browser compatibility')) return;
                handle(warning);
            },
            output: {
                dir: 'dist-lib',
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
                inlineDynamicImports: false,
                preserveModules: true,
                preserveModulesRoot: path.resolve(__dirname, 'src'),
                strict: false,
                assetFileNames: (asset) => {
                    return asset.names.some((name) => name.endsWith('.css'))
                        ? 'index.css'
                        : '[name][extname]';
                },
                entryFileNames: () => '[name].js',
            },
        },
        minify: false,
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                quietDeps: true,
                silenceDeprecations: ['import'],
            },
        },
    },
});

function copyFiles(src: string, dst: string) {
    if (!fs.existsSync(src)) return;

    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        if (!fs.existsSync(dst)) {
            fs.mkdirSync(dst, {recursive: true});
        }
        fs.readdirSync(src).forEach((nested) => {
            copyFiles(path.join(src, nested), path.join(dst, nested));
        });
    } else {
        const dstDir = path.dirname(dst);
        if (!fs.existsSync(dstDir)) {
            fs.mkdirSync(dstDir, {recursive: true});
        }
        fs.copyFileSync(src, dst);
    }
}
