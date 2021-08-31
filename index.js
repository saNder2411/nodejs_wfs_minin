const express = require('express')
const expHbs = require('express-handlebars')
const path = require('path')

const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const addRoutes = require('./routes/add')
const cartRoutes = require('./routes/cart')

const app = express()

const hbs = expHbs.create({ defaultLayout: 'main', extname: 'hbs' })

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.static(path.join(__dirname, 'public')))
// app.use(express.favicon())
app.use(express.urlencoded({ extended: true }))

app.use('/', homeRoutes)
app.use('/courses', coursesRoutes)
app.use('/add', addRoutes)
app.use('/cart', cartRoutes)

const { pid } = process
const PORT = process.env.PORT || 3000
const password = 'sander123'
const url = `mongodb+srv://user001:${password}@cluster0.dkmff.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

app.listen(PORT, () => {
  console.log(`Worker started Pid: ${pid}`)
  console.log(`Server started on port http://localhost:${PORT}`)
})
