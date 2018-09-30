# return-correct-data-model
[![Build Status](https://travis-ci.com/dlhandsome/return-correct-data-model.svg?branch=master)](https://travis-ci.com/dlhandsome/return-correct-data-model)
[![npm-version](https://img.shields.io/npm/v/rcdm.svg)](https://www.npmjs.com/package/rcdm)

Define your own models & returns the correct data structure.

If we rely on the data provided in a sandbox environment, this is very dangerous. We don't know if it returns an elephant or a mouse, but in fact we need a horse. But we can use this library to pre-define the data structures we expect and to ensure reliable results.

### Usage
```bash
npm i rcdm -S
```

### Example
```javascript
import { defineModel } from 'rcdm'

// define your own models
const people = defineModel({
  name: String,
  age: { type: Number, default: 18 }
})

const company = defineModel({
  list: { type: Array, extend: people }
})

// return the data you expected
const p0 = people() // => { name: '', age: 18 }
const p1 = people({ name: 'Tony', age: '19' }) // => { name: 'Tony', age: 19 }
const p2 = people({ name: 'Tom', age: '20a' }) // => { name: 'Tom', age: 18 }

const c0 = company() // => { list: [] }
const c1 = company({ list: [{}] }) // => { list: [{ name: '', age: 18 }] }
const c2 = company({ list: [{ name: 'Tony', age: '19' }] }) // => { list: [{ name: 'Tony', age: 19 }] }
```

### Why i write it

As a front-end engineer, I often have to tune some data with the back-end engineer. In order to transmit the correct data, we often write some ugly code.

```javascript
fetch('/api', {
  id: Number(id),
  list: list || []
})
```

Sometimes a request field for a data interface depends on the return value of another data interface, but I can't guarantee that the previous data interface returns the correct data structure

```javascript
let id = sth.id
let list = sth.list

const result1 = await fetch('/api/foo', {
  id: id && !isNaN(Number(id)) && Number(id) || DEFAULT_ID,
  list: list || []
})

const params = result1.data

const result2 = await fetch('/api/bar', {
  id: params && params.id && !isNaN(Number(params.id)) && Number(params.id) || DEFAULT_ID,
})

```

and now, after using ```rcdm```

- ```def.js```

```javascript
const { defineModel } = require('rcdm')

export const foo = defineModel({
 id: Number,
 list: Array
})

export const bar = defineModel({
  id: Number
})

```

- ```page.js```

```javascript
import { foo, bar } from './def'

let id = sth.id
let list = sth.list

const result1 = await fetch('/api/foo', foo({
  id,
  list
}))

const params = result1.data

const result2 = await fetch('/api/bar', bar({
  id: params.id
}))
```

### Contributing
```bash
# step 01
git clone https://github.com/dlhandsome/return-correct-data-model.git
# step 02
npm install
#step 03
npm run dev
```

### License
The MIT License
