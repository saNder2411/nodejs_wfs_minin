const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  cart: {
    items: [
      {
        count: { type: Number, required: true, default: 1 },
        courseId: { type: Schema.Types.ObjectId, required: true, ref: 'Course' },
      },
    ],
  },
})

userSchema.methods = {
  async addToCart(course) {
    let items = [...this.cart.items]
    const idx = items.findIndex((c) => c.courseId.toString() === course._id.toString())

    if (idx >= 0) {
      items[idx].count = items[idx].count + 1
    } else {
      items = [...items, { count: 1, courseId: course._id }]
    }

    this.cart = { items }
    await this.save()
    return this
  },
  async deleteFromCart(courseId) {
    let items = [...this.cart.items]
    const idx = items.findIndex((c) => c.courseId.toString() === courseId.toString())

    if (items[idx].count === 1) {
      items = items.filter((c) => c.courseId.toString() !== courseId.toString())
    } else {
      items[idx].count--
    }

    this.cart = { items }
    await this.save()
    return this
  },

  async clearCart() {
    this.cart = { items: [] }
    await this.save()
    return this
  },
}

module.exports = model('User', userSchema)
