/**
 * vue插件：全局复用echarts方法
 * 语法：{install(Vue){}}
 */
import * as echarts from 'echarts/core'
import { TooltipComponent } from 'echarts/components'
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([TooltipComponent, RadarChart, CanvasRenderer])
export default {
  install (Vue) {
    Vue.prototype.echarts = echarts
  }
}

