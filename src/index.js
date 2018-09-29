import {
  strHandler,
  numHandler,
  arrHandler,
  booHandler,
  customHandler
} from './transform'

import {
  isArr,
  isPlainObject
} from './utils'

export function parseValue (t, val) {
  let extend, defaultVal

  if (isArr(t)) {
    return t.some((type) => parseValue(type, val))
  }
  if (isPlainObject(t)) {
    extend = t.extend
    defaultVal = t.default
    t = t.type
  }

  switch (t) {
    case String:
      return strHandler(val, defaultVal)
    case Number:
      return numHandler(val, defaultVal)
    case Boolean:
      return booHandler(val, defaultVal)
    case Array:
      return arrHandler(val, defaultVal, extend, parseValue)
    default:
      return customHandler(t, val, defaultVal)
  }
}

export function defineModel (def) {
  if (isPlainObject(def)) {
    return model => {
      const rst = Object.assign.apply(
        null,
        Object.keys(def)
          .map(key => {
            let modelValue = isPlainObject(model) ? model[key] : null
            let parse = {}

            parse[key] = parseValue(def[key], modelValue)
            return parse
          })
      )
      return rst
    }
  }
}

export default {
  version: __VERSION__,
  defineModel,
  parseValue,
  parseStr: strHandler,
  parseArr: arrHandler,
  parseBoo: booHandler,
  parseNum: numHandler
}
