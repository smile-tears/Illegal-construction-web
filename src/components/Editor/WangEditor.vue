<template>
  <div :class="prefixCls">
    <div ref="editor" class="editor-wrapper"></div>
  </div>
</template>

<script>
import WEditor from 'wangeditor'
import config from '@/config/defaultSettings'

export default {
  name: 'WangEditor',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-editor-wang'
    },
    // eslint-disable-next-line
    value: {
      type: String
    }
  },
  data () {
    return {
      editor: null,
      editorContent: null
    }
  },
  watch: {
    value (val) {
      this.editorContent = val
      this.editor.txt.html(val)
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      var editor = new WEditor(this.$refs.editor)
      this.editor = editor
      // this.editor.onchangeTimeout = 200
      this.editor.customConfig.onchange = (html) => {
        this.editorContent = html
        this.$emit('change', this.editorContent)
      }

      //图片上传
      editor.customConfig.showLinkImg = false  //关闭网络路径图片方式
      editor.customConfig.uploadImgServer = config.url + '/upload-avatar' // 上传图片的接口地址
      editor.customConfig.uploadFileName = 'avatar' // formdata中的name属性
      editor.customConfig.debug = true // 开启debug模式
      editor.customConfig.uploadImgHooks = {
        // 图片上传并返回结果，但图片插入错误时触发
        fail: function (xhr, editor, result) {
          console.log(result)
        },
        success: function (xhr, editor, result) {
          // 图片上传并返回结果，图片插入成功之后触发
          console.log(result, 'success')
        },
        customInsert: function ( insertImg ,result, editor) {
          var url = config.url + result.result.url;
          insertImg(url);
        }
      }

      this.editor.create()
    }
  }
}
</script>

<style lang="less" scoped>
.ant-editor-wang {
  .editor-wrapper {
    text-align: left;
  }
}
</style>
