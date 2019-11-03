import vue from 'rollup-plugin-vue'
import {terser} from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'
import css from 'rollup-plugin-css-only'

const commonUMDconfig = {
  file: 'dist/index.umd.min.js',
  format: 'umd',
  name: 'RokkaUploader',
  css: true,
  globals: {
    'vue-upload-component': 'VueUploadComponent',
    rokka: 'rokka',
  },
  sourcemap: true,
}
export default [
  {
    input: 'src/index.js',
    output: commonUMDconfig,
    plugins: [
      css({output: './dist/bundle.css'}),
      vue({css: false}),
      resolve(),
      terser({
        include: [/^.+\.min\.js$/],
        sourcemap: true,
      })
    ],
    external: ['vue-upload-component', 'rokka'],
  },
  {
    input: 'src/index.js',
    output: {file: 'dist/index.esm.js', format: 'es'},
    plugins: [
      vue(),
      resolve(),
    ],
    external: ['vue-upload-component', 'rokka'],
  },
]
