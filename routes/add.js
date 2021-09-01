const { Router } = require('express')
const Course = require('../models/course')

const router = Router()

router.get('/', (_req, res) => res.render('add', { title: 'Add new course', isAdd: true }))

router.post('/', async (req, res) => {
  const { title, price, img } = req.body
  const course = new Course({ title, price, img, userId: req.user._id })

  try {
    await course.save()
    res.redirect('/courses')
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
