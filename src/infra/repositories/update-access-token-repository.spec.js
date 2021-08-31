const MongoHelper = require('../helpers/mongo-helper')
const MissingParamError = require('../../util/errors/missing-param-error')
const UpdateAccessTokenRepository = require('./update-access-token-repository')

let userModel, fakeUserId

describe('UpdateAccessTokenRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
    const insertedFakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 50,
      state: 'any_state',
      password: 'hashed_password'
    })
    fakeUserId = insertedFakeUser.insertedId
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = () => {
    return new UpdateAccessTokenRepository()
  }

  test('Should update the user with the given AccessToken', async () => {
    const sut = makeSut()
    await sut.update(fakeUserId, 'valid_token')
    const updatedFakeUser = await userModel.findOne({ _id: fakeUserId })
    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })

  test('Should throw if no params are provided', async () => {
    const sut = makeSut()
    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(fakeUserId)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
