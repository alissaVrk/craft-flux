import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import svgr from '@svgr/rollup'


const packageJson = require('./package.json');

export default [
    {
    input: 'src/lib.ts',
    output: [
        {
            file: packageJson.main,
            format: 'cjs',
            sourcemap: true,
            name: 'react-lib'
        }, {
            file: packageJson.module,
            format: 'esm',
            sourcemap: true
        }
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        svgr({template:(variables, { tpl }) => {
            return tpl`
                ${variables.imports};
                ${variables.interfaces};
                const ${variables.componentName} = (${variables.props}) => (
                        ${variables.jsx}
                );
           
            ${variables.exports};
            export const ReactComponent = ${variables.componentName};
          `
          }}),
        commonjs(),
        typescript({ tsconfig: './tsconfig.json' }),
        injectProcessEnv({ 
            NODE_ENV: 'development',
        }),
        terser()
    ]
}]