const { Router } = require('express')
const Course = require('../models/course')

const router = Router()

router.get('/', async (req, res) => {
  try {
    const user = await req.user.populate('cart.items.courseId')
    const courses = user.cart.items.map((c) => ({ ...c.courseId._doc, count: c.count }))
    const totalPrice = courses.reduce((sum, c) => (sum += c.price * c.count), 0)

    res.render('cart', { title: 'Cart', isCart: true, courses, totalPrice })
  } catch (err) {
    console.log(err)
  }
})

router.post('/add', async (req, res) => {
  try {
    const course = await Course.findById(req.body._id)
    await req.user.addToCart(course)

    res.redirect('/cart')
  } catch (err) {
    console.log(err)
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    await req.user.deleteFromCart(req.params.id)
    const user = await req.user.populate('cart.items.courseId')
    const courses = user.cart.items.map((c) => ({ ...c.courseId._doc, count: c.count }))
    const totalPrice = courses.reduce((sum, c) => (sum += c.price * c.count), 0)

    res.status(200).json({ courses, totalPrice })
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
