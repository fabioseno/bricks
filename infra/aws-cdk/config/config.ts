export const configValues = {
  env: {
    account: '849184581497',
    region: 'us-east-1'
  },
  email: {
    host: { parameter: '/email/host', value: 'smtp.bla.com.br' },
    port: { parameter: '/email/port', value: '465' },
    username: { parameter: '/email/username', value: 'email' },
    password: { parameter: '/email/password', value: 'password' },
  },
  database: {
    instanceName: 'bricks-dev',
    host: { parameter: '/db/host', value: 'password' },
    port: { parameter: '/db/port', value: '3306' },
    user: { parameter: '/db/user', value: 'bricks' },
    password: { parameter: '/db/password', value: 'pwd' },
    database: { parameter: '/db/database', value: 'bricks' },
    connectionLimit: { parameter: '/db/connection-limit', value: '20' }
  }
}