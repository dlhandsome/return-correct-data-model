import {
  isArr,
  isFunc,
  isNull,
  isUndef
} from './utils'

export function strHandler (v, defaultVal = '') {
  return (isUndef(v) || isNull(v))
    ? defaultVal
    : String(v)
}

export function numHandler (v, defaultVal = 0) {
  return (isUndef(v) || isNull(v) || isNaN(Number(v)))
    ? defaultVal
    : Number(v)
}

export function arrHandler (v, defaultVal = [], childHandler, parseHandler) {
  if (
    !isNull(childHandler) &&
    !isUndef(childHandler)
  ) {
    if (isArr(v)) {
      v = v.map(uniqVal => {
        return parseHandler.call(this, childHandler, uniqVal)
      })
    }
  }
  return (isUndef(v) || isNull(v))
    ? defaultVal
    : [].concat(v)
}

export function booHandler (v, defaultVal = false) {
  return isUndef(v)
    ? defaultVal
    : !!v
}

export function customHandler (t, ...args) {
  return isFunc(t)
    ? t.apply(this, args)
    : args[0]
}
