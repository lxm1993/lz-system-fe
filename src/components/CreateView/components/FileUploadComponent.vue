<template>
  <el-upload :action="''"
    :http-request="fUploadRequest"
    :show-file-list="false"
    v-bind="config.attrs"
    class="create_view_uploadfile">
    <el-button size="small"
      class="upload-btn"
      plain>选择文件</el-button>
    <el-tag v-if="fileName"
      type="info">{{ fileName }}</el-tag>
  </el-upload>
</template>
<script>
// 云飞提供接口，最大50M
const UploadUrl = 'http://10.16.19.32:9300/upload/file'
export default {
  // 单文件上传组件
  name: 'FileUpload',
  props: {
    value: {
      type: String,
      default: '',
    },
    config: {
      type: Object,
      default: () => {
        return {
          type: 'FileUpload',
          prop: 'fileUpload',
          formItemAttrs: {
            label: 'fileUpload',
            rules: [
              {
                required: true, message: '请输入', trigger: 'blur',
              },
            ],
          },
          attrs: {
            uploadUrl: '', // 上传地址
            allowFileTypes: '',// 允许文件类型数组 ['png', 'jpg', 'gif', 'svg']
            maxSize: ''// 限制大小单位数值，例如 1代表1M
          },
        }
      },
    },
  },
  data() {
    return { fileName: this.model }
  },
  watch: {
    value(val) {
      // 当重置时清空文件名
      if (!val) {
        this.fileName = ''
      }
    },
  },
  computed: {
    model: {
      get: function () {
        return this.value
      },
      set: function (val) {
        // 当重置时清空文件名
        if (!val) {
          this.fileName = ''
        }
        this.$emit('input', val)
      },
    },
  },
  methods: {
    fUploadRequest(param) {
      let attrs = this.config.attrs
      let fileUploadUrl = attrs && attrs.uploadUrl || UploadUrl
      let allowFileTypes = attrs && attrs.allowFileTypes
      let maxSize = attrs && attrs.maxSize

      let file = param.file
      // 类型检查
      let fileSplits = file.name.split('.')
      let fileType = fileSplits[fileSplits.length - 1]
      if (allowFileTypes && !allowFileTypes.includes(fileType)) {
        this.$message.error(`请上传${allowFileTypes.join(',')}类型文件～`)
        return
      }
      // 大小
      if (maxSize && (file.size / 1024 / 1024 / maxSize > 1)) {
        this.$message.error(`上传图片体积不能大于${maxSize}MB`)
        return
      }
      var formData = new FormData()
      formData.append('file', file)
      var xhr = new XMLHttpRequest()
      xhr.open('put', fileUploadUrl, true)
      xhr.onload = () => {
        let response = JSON.parse(xhr.response)
        if (response.code === 200 && response.data) {
          this.fileName = file.name
          this.model = response.data.url
        }
      }
      xhr.onerror = () => {
        this.$message.error('上传过程中发生错误请重新上传～')
      }
      xhr.send(formData)
    },
  },
}
</script>
<style lang="scss" scoped>
.upload-btn {
  margin-right: 10px;
  width: 100px;
}
.el-tag {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
</style>
