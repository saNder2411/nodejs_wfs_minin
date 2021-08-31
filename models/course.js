const uuid = require('uuid').v4
const fs = require('fs')
const path = require('path')

module.exports = class Course {
  static dbPath = path.join(__dirname, '..', 'data', 'courses.json')
  constructor(title, price, img) {
    this.id = uuid()
    this.title = title
    this.price = price
    this.img = img
  }

  async save() {
    const courses = await Course.getAll()
    const processData = JSON.stringify([...courses, this], null, 2)

    await new Promise((resolve, reject) =>
      fs.writeFile(Course.dbPath, processData, (err) => (err ? reject(err) : resolve()))
    )
  }

  static async getAll() {
    return new Promise((resolve, reject) =>
      fs.readFile(Course.dbPath, { encoding: 'utf-8' }, (err, data) => (err ? reject(err) : resolve(JSON.parse(data))))
    )
  }

  static async getById(id) {
    const courses = await Course.getAll()
    return courses.find((c) => c.id === id)
  }

  static async update(course) {
    const courses = await Course.getAll()
    const idx = courses.findIndex((c) => c.id === course.id)
    const processData = JSON.stringify([...courses.slice(0, idx), course, ...courses.slice(idx + 1)], null, 2)

    await new Promise((resolve, reject) =>
      fs.writeFile(Course.dbPath, processData, (err) => (err ? reject(err) : resolve()))
    )
  }
}
