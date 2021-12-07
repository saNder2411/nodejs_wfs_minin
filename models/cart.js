const fs = require('fs')
const path = require('path')

const dbPath = path.join(path.dirname(require.main.filename), 'data', 'cart.json')

module.exports = class Cart {
  static async fetch() {
    return new Promise((resolve, reject) =>
      fs.readFile(dbPath, 'utf-8', (err, data) => (err ? reject(err) : resolve(JSON.parse(data))))
    )
  }

  static async add(course) {
    const cart = await Cart.fetch()

    const idx = cart.courses.findIndex((c) => c.id === course.id)

    const candidate = cart.courses[idx]

    if (candidate) {
      candidate.count++
      cart.courses[idx] = candidate
    } else {
      cart.courses.push({ ...course, count: 1 })
    }

    cart.totalPrice += +course.price

    await new Promise((resolve, reject) =>
      fs.writeFile(dbPath, JSON.stringify(cart, null, 2), (err) => (err ? reject(err) : resolve()))
    )
  }

  static async delete(id) {
    const cart = await Cart.fetch()

    const idx = cart.courses.findIndex((c) => c.id === id)

    const course = cart.courses[idx]

    if (+course.count === 1) {
      cart.courses = cart.courses.filter((c) => c.id !== id)
    } else {
      cart.courses[idx].count--
    }

    cart.totalPrice -= course.price

    return await new Promise((resolve, reject) =>
      fs.writeFile(dbPath, JSON.stringify(cart, null, 2), (err) => (err ? reject(err) : resolve(cart)))
    )
  }
}
