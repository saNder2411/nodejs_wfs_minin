const { Router } = require('express')
const Course = require('../models/course')

const router = Router()

router.get('/', async (_req, res) => {
  const courses = await Course.getAll()

  res.render('courses', { title: 'All courses', isCourses: true, courses })
})

router.get('/:id', async (req, res) => {
  const course = await Course.getById(req.params.id)
  res.render('course', { layout: 'empty', title: course.title, course })
})

router.get('/:id/edit', async (req, res) => {
  if (!req.query.allow) return res.redirect('/')

  const course = await Course.getById(req.params.id)

  res.render('course-edit', { title: 'Edit course', course })
})

router.post('/edit', async (req, res) => {
  console.log(req.body)
  await Course.update(req.body)

  res.redirect('/courses')
})

module.exports = router
