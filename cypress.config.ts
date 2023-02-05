import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack'
    }
  },

  e2e: {
    baseUrl: 'http://localhost'
  }
})
