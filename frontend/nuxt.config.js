export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Eleos',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'github-markdown-css/github-markdown-light.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/wallet'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    '@nuxt/http',
    '@nuxtjs/dayjs',
    'nuxt-graphql-request',
    '@nuxtjs/markdownit'
  ],

  graphql: {
    clients: {
      default: {
        options: {
          method: 'POST'
        }
      }
    }
  },

  http: {
    baseURL: process.env.API_BASEURL || 'http://localhost:3000'
  },

  dayjs: {
    plugins: [
      'relativeTime'
    ]
  },

  markdownit: {
    runtime: true,
    linkify: true
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  publicRuntimeConfig: {
    api_url: process.env.API_BASEURL || 'http://localhost:3000',
    ganache_url: process.env.GANACHE_BASEURL || 'http://localhost:8545',
    chain_id: process.env.CHAIN_ID || '0x539', // Chain ID: 1337
    graphql: {
      clients: {
        default: {
          endpoint: (process.env.API_BASEURL || 'http://localhost:3001') + '/graphql'
        }
      }
    }
  },

  privateRuntimeConfig: {
  },

  router: {
    // middleware: ['route']
  }
}
