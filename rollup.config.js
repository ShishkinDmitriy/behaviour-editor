import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from 'rollup-plugin-babel';
import alias from 'rollup-plugin-alias';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';
import path from 'path';
import {sass} from 'svelte-preprocess-sass';
import typescript from "rollup-plugin-typescript2";

import {
	preprocess,
	createEnv,
	readConfigFile
} from "@pyoner/svelte-ts-preprocess";

const production = !process.env.ROLLUP_WATCH;

const env = createEnv();
const compilerOptions = readConfigFile(env);
const opts = {
	env,
	compilerOptions: {
			...compilerOptions,
			allowNonTsExtensions: true
	}
};

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) => (warning.code === 'CIRCULAR_DEPENDENCY') || onwarn(warning);
// && /[/\\]@sapper[/\\]/.test(warning.message)
export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		plugins: [
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode),
				'process.env.FAKE_API': process.env.FAKE_API,
				'process.env.HISTORY_PERIOD': process.env.HISTORY_PERIOD
			}),
			alias({
				resolve: ['.svelte', '.js', '.ts'],
				'@': path.resolve('./src'),
			}),
			svelte({
				dev,
				hydratable: true,
				emitCss: true,
				preprocess: {
					style: sass(),
					...preprocess(opts),
				}
			}),
			resolve({
				browser: true
			}),
			commonjs(),
			typescript(),

			legacy && babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				runtimeHelpers: true,
				exclude: ['node_modules/@babel/**'],
				presets: [
					['@babel/preset-env', {
						targets: '> 0.25%, not dead'
					}]
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					['@babel/plugin-transform-runtime', {
						useESModules: true
					}]
				]
			}),

			!dev && terser({
				module: true
			})
		],

		onwarn,
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
			replace({
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode),
				'process.env.FAKE_API': process.env.FAKE_API,
				'process.env.HISTORY_PERIOD': process.env.HISTORY_PERIOD
			}),
			alias({
				resolve: ['.svelte', '.js', '.ts'],
				'@': path.resolve('./src'),
			}),
			svelte({
				generate: 'ssr',
				dev,
				preprocess: {
					style: sass(),
					...preprocess(opts),
				}
			}),
			resolve(),
			commonjs(),
			typescript()
		],
		external: Object.keys(pkg.dependencies).concat(
			require('module').builtinModules || Object.keys(process.binding('natives'))
		),

		onwarn,
	},

	serviceworker: {
		input: config.serviceworker.input(),
		output: config.serviceworker.output(),
		plugins: [
			resolve(),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode),
				'process.env.FAKE_API': process.env.FAKE_API
			}),
			commonjs(),
			!dev && terser()
		],

		onwarn,
	}
};
