const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const MissingParamError = require('../../util/errors/missing-param-error')

let db

const makeSut = () => {
  return new LoadUserByEmailRepository()
}

describe('LoadUserByEmailRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  test('Should return null if no user is found', async () => {
    const sut = makeSut()
    const user = await sut.load('invalid_email@mail.com')
    expect(user).toBeUndefined()
  })

  test('Should return an user if user is found', async () => {
    const sut = makeSut()

    const insertedFakeUser = await db.collection('users').insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 50,
      state: 'any_state',
      password: 'hashed_password'
    })

    const fakeUser = await db.collection('users').findOne({ _id: insertedFakeUser.insertedId })

    const user = await sut.load('valid_email@mail.com')
    expect(user).toEqual({
      _id: fakeUser._id,
      password: fakeUser.password
    })
  })

  test('Should throw if no email is provided', async () => {
    const sut = makeSut()
    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
