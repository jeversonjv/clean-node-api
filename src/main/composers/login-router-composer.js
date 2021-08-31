const LoginRouter = require('../../presentation/routers/login-router')
const AuthUseCase = require('../../domain/usecases/auth-usecase')
const EmailValidator = require('../../util/helpers/email-validator')
const LoadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository')
const UpdateAccessTokenRepository = require('../../infra/repositories/update-access-token-repository')
const Encrypter = require('../../util/helpers/encrypter')
const TokenGenerator = require('../../util/helpers/token-generator')
const env = require('../config/env')

module.exports = class LoginRouterComposer {
  static compose () {
    const tokenGenerator = new TokenGenerator(env.tokenSecret)
    const encrypter = new Encrypter()
    const updateAccessTokenRepository = new UpdateAccessTokenRepository()
    const loadUserByEmailRepository = new LoadUserByEmailRepository()
    const emailValidator = new EmailValidator()
    const authUseCase = new AuthUseCase({
      loadUserByEmailRepository,
      updateAccessTokenRepository,
      encrypter,
      tokenGenerator
    })
    return new LoginRouter({
      authUseCase, emailValidator
    })
  }
}
