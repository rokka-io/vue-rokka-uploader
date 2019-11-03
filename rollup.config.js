import vue from 'rollup-plugin-vue'
import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'

const commonUMDconfig = {
  file: 'dist/index.umd.min.js',
  format: 'umd',
  name: 'vueRokkaUploader',
  exports: 'named',
  css: true,
  globals: {
    'vue-upload-component': 'FileUploader',
    rokka: 'rokka',
  },
  sourcemap: true,
}
const plugins = [
  vue(),
  resolve(),

  terser({
    include: [/^.+\.min\.js$/],
    sourcemap: true,
  }),
]
export default [

  {
    input: 'src/index.js',
    output: [commonUMDconfig, { file: 'dist/index.esm.js', format: 'es' }],
    plugins: plugins,
    external: ['vue-upload-component', 'rokka'],
  },
]
