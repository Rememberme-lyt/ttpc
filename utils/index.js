/**
 * Created by PanJiaChen on 16/11/18.
 */
/**
 *
 * @param {*} list 数组（不是树形数据）
 * 转换结果：[{name:'',children:[]}]=>树形结构
 * 根据现有数据找规律：
 * 1. 公司pid的值是：-1
 * 2. 公司下的顶级部门pid的值是：''(空字符串)
 * 3. 公司下的子孙部门的pid的值是：父部门的id值
 * 核心：找父部门
 * 思路步骤：
 * 1. 新建转换的树形数据：[]
 * 2. 构建映射关系：map
 * 3. 根据map映射关系遍历list对比
 * 4. 返回转换完的树形结构
 */
export function transformTreeData (list) {
  console.log('要转换的数据：', list)
  const treeData = []
  // 映射关系
  const map = {}
  list.forEach(item => {
    map[item.id] = item
  })
  console.log('映射关系：', map)
  list.forEach(item => {
    // 排除pid=-1公司
    if (item.pid === '-1') return
    /**
     * 核心：根据pid的值从map映射关系中找父部门
     * 1. '' => 顶级部门
     * 2. '父部门的id' =》父部门
     */
    const parent = map[item.pid]
    if (parent) {
      // 找到了
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(item)
    } else {
      // 没找到=》顶级（一级）部门
      treeData.push(item)
    }
  })
  // console.table(treeData)
  return treeData
}

// excel时间格式化
/**
 *
 * @param {*} numb excel时间格式
 * @param {*} format 转换分隔符
 * @returns 标准时间格式
 */
export function formatExcelDate (numb, format) {
  // 天数
  const time = new Date((numb - 1) * 24 * 3600000 + 1)
  console.log(time)
  time.setYear(time.getFullYear() - 70)
  const year = time.getFullYear() + ''
  const month = time.getMonth() + 1 + ''
  const date = time.getDate() + ''
  // 转换的格式符号
  if (format && format.length === 1) {
    return year + format + month + format + date
  }
  return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime (time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj (url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}
