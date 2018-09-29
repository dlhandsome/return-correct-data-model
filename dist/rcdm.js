/**
 * return-correct-data-model v0.1.0
 * (c) 2018 dlhandsome
 * @license MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Rcdm = {})));
}(this, (function (exports) { 'use strict';

/**
 * String type check
 */

/**
 * Number type check
 */

/**
 * Array type check
 */
var isArr = Array.isArray;
/**
 * undefined type check
 */
var isUndef = function (v) { return v === undefined; };
/**
 * null type check
 */
var isNull = function (v) { return v === null; };
/**
 * Function type check
 */
var isFunc = function (v) { return typeof v === 'function'; };
/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */



/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
var _toString = Object.prototype.toString;
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}



/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */


/**
 * Check if val is a valid array index.
 */


/**
 * Convert an Array-lik object to a real Array
 */

function strHandler (v, defaultVal) {
  if ( defaultVal === void 0 ) defaultVal = '';

  return (isUndef(v) || isNull(v))
    ? defaultVal
    : String(v)
}

function numHandler (v, defaultVal) {
  if ( defaultVal === void 0 ) defaultVal = 0;

  return (isUndef(v) || isNull(v) || isNaN(Number(v)))
    ? defaultVal
    : Number(v)
}

function arrHandler (v, defaultVal, childHandler, parseHandler) {
  var this$1 = this;
  if ( defaultVal === void 0 ) defaultVal = [];

  if (
    !isNull(childHandler) &&
    !isUndef(childHandler)
  ) {
    if (isArr(v)) {
      v = v.map(function (uniqVal) {
        return parseHandler.call(this$1, childHandler, uniqVal)
      });
    }
  }
  return (isUndef(v) || isNull(v))
    ? defaultVal
    : [].concat(v)
}

function booHandler (v, defaultVal) {
  if ( defaultVal === void 0 ) defaultVal = false;

  return isUndef(v)
    ? defaultVal
    : !!v
}

function customHandler (t) {
  var args = [], len = arguments.length - 1;
  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  return isFunc(t)
    ? t.apply(this, args)
    : args[0]
}

function parseValue (t, val) {
  var extend, defaultVal;

  if (isArr(t)) {
    return t.some(function (type) { return parseValue(type, val); })
  }
  if (isPlainObject(t)) {
    extend = t.extend;
    defaultVal = t.default;
    t = t.type;
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

function defineModel (def) {
  if (isPlainObject(def)) {
    return function (model) {
      var rst = Object.assign.apply(
        null,
        Object.keys(def)
          .map(function (key) {
            var modelValue = isPlainObject(model) ? model[key] : null;
            var parse = {};

            parse[key] = parseValue(def[key], modelValue);
            return parse
          })
      );
      return rst
    }
  }
}

var index = {
  version: "0.1.0",
  defineModel: defineModel,
  parseValue: parseValue,
  parseStr: strHandler,
  parseArr: arrHandler,
  parseBoo: booHandler,
  parseNum: numHandler
};

exports.parseValue = parseValue;
exports.defineModel = defineModel;
exports['default'] = index;

Object.defineProperty(exports, '__esModule', { value: true });

})));
