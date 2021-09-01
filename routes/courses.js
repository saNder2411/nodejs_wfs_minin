const { Router } = require('express')
const Course = require('../models/course')

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const courses = await Course.find().populate('userId', 'email name')
    res.render('courses', { title: 'All courses', isCourses: true, courses })
  } catch (err) {
    console.log(err)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    res.render('course', { layout: 'empty', title: course.title, course })
  } catch (err) {
    console.log(err)
  }
})

router.get('/:id/edit', async (req, res) => {
  if (!req.query.allow) return res.redirect('/')
  try {
    const course = await Course.findById(req.params.id)
    res.render('course-edit', { title: 'Edit course', course })
  } catch (err) {
    console.log(err)
  }
})

router.post('/edit', async (req, res) => {
  try {
    const { _id, ...processEntity } = req.body
    await Course.findByIdAndUpdate(_id, processEntity)
    res.redirect('/courses')
  } catch (err) {
    console.log(err)
  }
})

router.post('/delete', async (req, res) => {
  try {
    const { _id } = req.body
    await Course.deleteOne({ _id })
    res.redirect('/courses')
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
