const { Router } = require('express')
const Order = require('../models/order')

const router = Router()

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id })
      .populate('user.userId')
      .then((docs) =>
        docs.map((d) => ({ ...d._doc, price: d.courses.reduce((sum, c) => (sum += c.count * c.course.price), 0) }))
      )

    res.render('orders', { title: 'Orders', isOrders: true, orders })
  } catch (err) {
    console.log(err)
  }
})

router.post('/', async (req, res) => {
  try {
    const userWithFullCartItems = await req.user.populate('cart.items.courseId')
    const courses = userWithFullCartItems.cart.items.map((c) => ({ course: { ...c.courseId._doc }, count: c.count }))
    const order = new Order({ courses, user: { name: req.user.name, userId: req.user._id } })

    await order.save()
    await req.user.clearCart()
    res.redirect('/orders')
  } catch (err) {
    console.log(err)
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
