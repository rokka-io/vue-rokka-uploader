<template>
  <div class="rokka-uploader upload">
    <img
      v-if="biggerPreview"
      class="biggerPreview"
      :style="{ left: biggerPreviewLeft }"
      :src="biggerPreview"
    />

    <table v-if="files.length">
      <tr v-for="file in files" :key="file.id">
        <td class="remove">
          <button
            type="button"
            class="removeButton"
            @click.prevent="removeImage(file)"
          >
            x
          </button>
        </td>
        <td class="thumb">
          <img
            v-if="file.thumb"
            :src="file.thumb"
            @mouseenter="setBiggerPreview"
            @mouseleave="biggerPreview = null"
          />
          <span v-else>No Image</span>
        </td>
        <td>{{ file.name }}</td>
        <td>{{ formatSize(file.size) }}</td>
        <br />
        <td v-if="file.error">{{ file.error }}</td>
        <td v-else-if="file.success">Uploaded</td>
        <td v-else-if="file.active">Uploading</td>
        <td v-else>To upload</td>
      </tr>
    </table>

    <div v-else>
      <div class="text-center p-5">
        <h4>Drop files anywhere to upload</h4>
      </div>
    </div>

    <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
      <h3>Drop files to upload</h3>
    </div>

    <div class="rokka-upload-component">
      <vue-upload-component
        ref="upload"
        v-model="files"
        :custom-action="customAction"
        class="rokka-fileupload"
        :multiple="true"
        :drop="true"
        :drop-directory="true"
        :thread="3"
        @input-filter="inputFilter"
      >
        <slot>
          Select files
        </slot>
      </vue-upload-component>
      <slot name="buttons">
        <button
          type="button"
          class="button cancel"
          @click.prevent="$refs.upload.clear()"
        >
          Clear list
        </button>
        <button
          v-if="uploaded"
          type="button"
          class="button"
          @click.prevent="$refs.upload.active = false"
        >
          Uploaded
        </button>
        <button
          v-else-if="$refs.upload && !$refs.upload.active"
          type="button"
          class="button"
          @click.prevent="$refs.upload.active = true"
        >
          Start Upload
        </button>

        <button
          v-else
          type="button"
          class="button warning"
          @click.prevent="$refs.upload.active = false"
        >
          Stop Upload
        </button>
      </slot>
    </div>
  </div>
</template>

<script>
import VueUploadComponent from 'vue-upload-component'
import rokka from 'rokka'

export default {
  components: {
    VueUploadComponent,
  },
  props: {
    rokkaOrg: {
      type: String,
      required: true,
    },
    rokkaKey: {
      type: String,
      required: true,
    },
    appendPromise: {
      type: Function,
      default: null,
    },
    imageMetadata: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      files: [],
      active: false,
      uploaded: false,
      biggerPreview: null,
      biggerPreviewLeft: 0,
    }
  },

  watch: {
    files() {
      if (this.active !== this.$refs.upload.active) {
        this.active = this.$refs.upload.active
        this.$emit('uploading', this.active)
      }
      if (this.uploaded !== this.$refs.upload.uploaded) {
        this.uploaded = this.$refs.upload.uploaded
        this.$emit('uploaded', this.uploaded)
      }
    },
  },
  methods: {
    setBiggerPreview(e) {
      const box = e.target.parentNode.getBoundingClientRect()
      this.biggerPreviewLeft = box.left + box.width + 'px'
      this.biggerPreview = e.target.src
    },
    removeImage(file) {
      this.$refs.upload.remove(file)
    },
    customAction(file) {
      const rokkaC = rokka({
        apiKey: this.rokkaKey,
      })
      let metadata = {}
      if (this.imageMetadata) {
        metadata = this.imageMetadata(file)
      }
      console.log(file.data)
      const request = rokkaC.sourceimages
        .create(this.rokkaOrg, file.name, file.file, metadata)
        .then(resp => {
          return resp
        })
        .catch(err => {
          if (err.body && err.body.error && err.body.error.message) {
            const message = err.body.error.message
            if (message.includes('Invalid image format')) {
              throw 'Error: ' +
                message.replace(/(Invalid image format [a-z/]+).*/, '$1')
            }
            throw 'Error: ' + err.body.error.message
          }
          throw err
        })
      if (this.appendPromise) {
        return this.appendPromise(request)
      }
      return request
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // Filter system files or hide files
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        newFile.blob = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }
        // Thumbnails
        newFile.thumb = ''
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob
        }
      }
    },
    formatSize(size) {
      if (size > 1024 * 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
      } else if (size > 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
      } else if (size > 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + ' MB'
      } else if (size > 1024) {
        return (size / 1024).toFixed(2) + ' KB'
      }
      return size.toString() + ' B'
    },
  },
}
</script>

<style scoped>
.rokka-uploader /deep/ .drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: 0.6;
  text-align: center;
  background: #000;
}
.rokka-uploader .thumb {
  max-width: 80px;
}
.rokka-uploader .thumb img {
  max-width: 80px;
  max-height: 60px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.rokka-uploader .biggerPreview {
  position: fixed;
  left: 15vw;
  z-index: 100;
  max-width: 100%;
  max-height: 80%;
  perspective: 0;
  backface-visibility: hidden;
  will-change: transform;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
}
</style>
