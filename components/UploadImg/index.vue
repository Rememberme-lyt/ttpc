<template>
  <!--
  上传组件props：
  1. action 后台上传接口地址
  2. show-file-list 是否显示上传文件的列表
  3. on-success 上传成功之后执行的回调函数（和action配合使用）
  4. before-upload 上传之前执行的回调函数（文件格式、大小检验）
  5. http-request 自定义上传函数（自己写发请求上传的逻辑）
  上传组件满足需求：
  1. 回显之前存过的图片地址
  2. 如果重新上传能把最新上传的cos地址存到外边userInfo的staffPhoto上
 -->
  <el-upload
    class="avatar-uploader"
    action="#"
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="upload"
  >
    <!-- 默认插槽=》 默认显示+号图标=》上传有图片了=》就显示上传图片-->
    <img v-if="staffPhoto" :src="staffPhoto" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    <!-- 上传进度 -->
    <el-progress
      v-if="showProcess"
      type="line"
      :percentage="percentage"
      status="success"
      :stroke-width="6"
    ></el-progress>
  </el-upload>
</template>

<script>
// 导入cos的SDK调用
import COS from 'cos-js-sdk-v5'
// 初始化cos云上传示例（里边提供的有调用后台上传图片的方法）
const cos = new COS({
  SecretId: 'AKID2JMPE1qvDJCmTvdDTqxFgssaAVbRkxoR', // 身份识别ID
  SecretKey: 'Xw62h4GDwa4JIzUGqKgZyCAzwf9N5f06' // 身份秘钥
})
export default {
  name: 'UploadImg',
  props: {
    // 存储上传的图片地址（回显之前存过的图片地址）
    staffPhoto: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 存储上传的图片地址
      // imageUrl: '',
      // 控制进度条是否显示
      showProcess: false,
      // 上传进度(0-100)
      percentage: 0
    }
  },
  methods: {
    // 自定义上传的回调函数
    upload (params) {
      // 开始上传显示进度条
      this.showProcess = true
      // 1. 获取选择上传文件的file对象
      console.log(params.file)
      // 2. 后续调用腾讯云cos后台接口上传图片
      /**
       * cos.putObject(Object:{上传配置}, callback:Function(成功回调函数))
       */
      cos.putObject({
        Bucket: 'hrsass-1255477649', /* 必须 */
        Region: 'ap-beijing', /* 存储桶所在地域，必须字段 */
        Key: params.file.name, /* 必须(上传文件文件名) */
        StorageClass: 'STANDARD', // 标准模式存储
        Body: params.file, // 上传文件对象
        onProgress: (progressData) => {
          // 上传进度（0-1）=》progressData.percent的值 =》0.0 => 0.1 ... => 0.9 1
          console.log('当前图片的上传进度：', progressData.percent)
          this.percentage = progressData.percent * 100
        }
      }, (err, data) => {
        // 注意：回调函数改成箭头函数，因为function获取不到this
        // err 是null 表明上传成功 data 会包含Location图片存储地址
        // console.log(err, data)
        if (!err) {
          // 上传成功
          // 显示上传成功后的图片
          setTimeout(() => {
            // 不能直接修改父组件staffPhoto数据
            // this.staffPhoto = `https://${data.Location}`
            // 通过子传父
            this.$emit('update:staffPhoto', `https://${data.Location}`)
            // 上传完=》1. 关闭进度条 2. 重置进度条的值为0
            this.percentage = 0
            this.showProcess = false
          }, 800)
        }
      })
    },
    // handleAvatarSuccess (res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw)
    // },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
