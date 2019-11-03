<template>
  <div id="app">
    <rokka-uploader :rokka-key="rokkaKey" :rokka-org="rokkaOrg" ></rokka-uploader>
  </div>
</template>

<script>
import RokkaUploader from 'vue-rokka-uploader'

const rokkaKey = '....'

const rokkaOrg = 'playground'
export default {
  name: 'App',
  components: {
    RokkaUploader,
  },
  data() {
    return {
      rokkaKey: rokkaKey,
      rokkaOrg: rokkaOrg,
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 0 20px;
  color: #2c3e50;
}

.rokka-uploader .button, .rokka-uploader .rokka-fileupload {
  padding: 5px;
  background-color: transparent;
  border: 1px solid;
  display: inline-block;
  vertical-align: middle;
  font-size: 16px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

.rokka-uploader .drop-active h3 {
  margin: -0.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}

.rokka-uploader .removeButton {
  background-color: transparent;
  border: 0;
  font-weight: 100;
  color: black;
  cursor: pointer;
}

.rokka-uploader .remove {
  width: 5px;
  padding: 0;
}

.rokka-uploader td {
  padding: 3px 0;
}
</style>
