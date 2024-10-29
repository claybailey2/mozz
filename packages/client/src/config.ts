const config = {
  apiUrl: import.meta.env.DEV 
    ? 'http://localhost:3000/api'
    : '/api', // This should work with the relative path
}

export type Config = typeof config

export default config