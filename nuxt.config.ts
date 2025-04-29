import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: [
    "@nuxthub/core",
    "@nuxt/fonts",
    "@nuxtjs/turnstile",
    "@nuxt/scripts",
    "nuxt-auth-utils",
  ],

  // https://devtools.nuxt.com
  devtools: { enabled: true },
  css: ["~/assets/main.css"],

  // Env variables - https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens
  runtimeConfig: {
    public: {},
    turnstile: {
      secretKey: process.env.TURNSTILE_SECRET_KEY,
    },
  },
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  compatibilityDate: "2025-03-01",

  nitro: {
    experimental: {
      websocket: true,
    },
  },

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {
    database: true,
    workers: true,
    blob: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },

  // Development config
  eslint: {
    config: {
      stylistic: {
        quotes: "single",
        commaDangle: "never",
      },
    },
  },

  turnstile: {
    siteKey: process.env.TURNSTILE_SITE_KEY,
    addValidateEndpoint: true,
  },

  
});
