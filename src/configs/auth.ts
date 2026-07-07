export default {
  meEndpoint: `${process.env.NEXT_PUBLIC_APP_URL}/api/profile`,
  loginEndpoint: `${process.env.NEXT_PUBLIC_APP_URL}/api/login`,
  authorizationEndpoint: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/redirect`,
  callbackEndpoint: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
  registerEndpoint: `${process.env.NEXT_PUBLIC_APP_URL}/api/register`,
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
