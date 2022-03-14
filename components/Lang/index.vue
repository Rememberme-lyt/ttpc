<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <div>
      <!-- 语言图标 -->
      <svg-icon style="color: #fff; font-size: 20px" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="'zh' === $i18n.locale">
        中文
      </el-dropdown-item>
      <el-dropdown-item command="en" :disabled="'en' === $i18n.locale">
        en
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import ck from 'js-cookie'
export default {
  name: 'Lang',
  methods: {
    /**
     * lang 点击中文获取到zh | 点击英文获取到en
     */
    changeLanguage (lang) {
      // 存储当前语言状态
      /**
       * cookieg过期：
       * 1. 默认不设置 session
       * 2. 设置过期时间 {expires:3} => 数字（天） | 日期对象
       */
      const expires = new Date(Date.now() + 3 * 60 * 60 * 1000) // 3小时后过期
      ck.set('lang-status', lang, { expires })
      // this.$i18n 是翻译插件的实例
      this.$i18n.locale = lang // 设置给本地的i18n插件
      this.$message.success('切换多语言成功')
    }
  }
}
</script>
