const request = require('supertest')
const app = require('../config/app')

describe('JSON parser', () => {
  test('Should parse body as json', async () => {
    app.post('/test_json_parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test_json_parser')
      .send({ name: 'Jv' })
      .expect({ name: 'Jv' })
  })
})
