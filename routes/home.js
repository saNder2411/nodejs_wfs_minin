const { Router } = require('express')

const router = Router()

router.get('/', (_req, res) => res.render('index', { title: 'Home page', isHome: true }))

module.exports = router
