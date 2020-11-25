// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '48j2k042aa'
//export const apiEndpoint = `https://${apiId}.execute-api.ap-south-1.amazonaws.com/dev`
export const apiEndpoint = 'https://48j2k042aa.execute-api.ap-south-1.amazonaws.com/dev'
export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-50-bb05b.us.auth0.com',            // Auth0 domain
  clientId: '9Dkfa9R8Jo5YHoEVlo53ylFgWQ3bvRIm',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
