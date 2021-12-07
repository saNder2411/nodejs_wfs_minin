const express = require('express')
const Handlebars = require('handlebars')
const expHbs = require('express-handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const path = require('path')
const mongoose = require('mongoose')

const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const addRoutes = require('./routes/add')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')

const User = require('./models/user')

const app = express()

const hbs = expHbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  allowProtoMethodsByDefault: true,
  allowedProtoMethods: true,
  handlebars: allowInsecurePrototypeAccess(Handlebars),
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, _res, next) => {
  try {
    const user = await User.findById('612e4a8fd2075f16aa45c059')
    req.user = user
    next()
  } catch (err) {
    console.log(err)
  }
})
app.use(express.static(path.join(__dirname, 'public')))
// app.use(express.favicon())
app.use(express.urlencoded({ extended: true }))

app.use('/', homeRoutes)
app.use('/courses', coursesRoutes)
app.use('/add', addRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)

const { pid, env } = process
const PORT = env.PORT ?? 3000

async function start() {
  try {
    const password = 'sander123'
    const url = `mongodb+srv://user001:${password}@cluster0.dkmff.mongodb.net/courseShop`
    await mongoose.connect(url, { useNewUrlParser: true })

    const candidate = await User.findOne()

    if (!candidate) {
      const user = new User({ email: 'sander2411@gmail.com', name: 'Sander', cart: { items: [] } })
      await user.save()
    }
    app.listen(PORT, () => {
      console.log(`Worker started with Process id: ${pid}`)
      console.log(`Server started on port http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error(err)
  }
}

start()
