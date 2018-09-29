const {
  defineModel
} = require('../src/index')

const {
  isFunc
} = require('../src/utils')

const assert = require('assert')

function assertModel (def, input, expected) {
  if (isFunc(def)) {
    input = def(input)
    assert.deepStrictEqual(input, expected)
  }
}

describe('return correct data model', function () {
  describe('test base type transform', function () {
    const foo = defineModel({
      age: Number
    })

    it('test empty input', function () {
      const input = undefined
      const expected = {
        age: 0
      }
      assertModel(foo, input, expected)
    })

    it('something caused transform error', function () {
      const input = {
        age: '18a'
      }
      const expected = {
        age: 0
      }
      assertModel(foo, input, expected)
    })
  })

  describe('test default value', function () {
    it('test build in default', function () {
      const foo = defineModel({
        count: Number,
        list: Array
      })

      const input = void 0
      const expected = {
        count: 0,
        list: []
      }
      assertModel(foo, input, expected)
    })

    it('test custom default', function () {
      const foo = defineModel({
        count: { type: Number, default: 10 },
        list: { type: Array, default: ['custom'] }
      })

      const input = void 0
      const expected = {
        count: 10,
        list: ['custom']
      }
      assertModel(foo, input, expected)
    })
  })

  describe('test custom types', function () {
    const people = defineModel({
      name: String,
      age: { type: Number, default: 18 }
    })

    const company = defineModel({
      list: { type: Array, extend: people }
    })

    it('test empty input', function () {
      const input = undefined
      const expected = {
        list: []
      }
      assertModel(company, input, expected)
    })

    it('test custom default', function () {
      const input = {
        list: [{}]
      }

      const expected = {
        list: [
          {
            name: '',
            age: 18
          }
        ]
      }
      assertModel(company, input, expected)
    })
  })
})
