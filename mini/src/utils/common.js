/**
 * 显示消息提示框
 * @param content 提示的标题
 */
export function toast(content) {
  uni.showToast({
    icon: 'none',
    title: content,
  })
}

/**
 * 显示模态弹窗
 * @param content 提示的标题
 */
export function showConfirm(content) {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: '提示',
      content: content,
      cancelText: '取消',
      confirmText: '确定',
      success: function (res) {
        resolve(res)
      },
    })
  })
}

/**
 * 参数处理
 * @param params 参数
 */
export function tansParams(params) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    var part = encodeURIComponent(propName) + '='
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (
            value[key] !== null &&
            value[key] !== '' &&
            typeof value[key] !== 'undefined'
          ) {
            let params = propName + '[' + key + ']'
            var subPart = encodeURIComponent(params) + '='
            result += subPart + encodeURIComponent(value[key]) + '&'
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&'
      }
    }
  }
  return result
}

/**
 * 随机数
 * @param {Object} min
 * @param {Object} max
 */
export function getRandomNum(min, max) {
  var range = max - min
  var rand = Math.random()
  return min + Math.round(range * rand)
}

export function getSameData(arr1, arr2, key) {
  const idMapping = arr1.reduce((acc, el, i) => {
    acc[el[key]] = i
    return acc
  }, {})
  arr2.forEach((i) => {
    if (idMapping[i[key]]) {
      //重复值
      i.checked = true
    }
  })
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

//搜索框关键词存储
export function saveKeyWord(type, val) {
  let arr = []
  if (uni.getStorageSync(type)) {
    let arr = JSON.parse(uni.getStorageSync(type))
    if (arr.indexOf(val) != -1) {
      console.log('arr.indexOf(val)', arr.indexOf(val))
      arr.splice(arr.indexOf(val), 1)
    }
    arr.unshift(val)
    if (arr.length > 6) {
      arr.pop()
    }
    uni.setStorageSync(type, JSON.stringify(arr))
    return arr
  } else {
    arr.unshift(val)
    uni.setStorageSync(type, JSON.stringify(arr))
    return arr
  }
}

//价格保留两位小数点正则
export function testPrice(val) {
  let reg = /^\d+(\.([0-9]|\d[0-9]))?$/
  return reg.test(val)
}

/**
 * 深拷贝
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}
