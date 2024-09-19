module.exports = {
  // @source https://eslint.vuejs.org/rules/
  extends: [
    // On desactive certains regle en attendant de trouver comment fixer cela automatiquement via vue.config.js
    //"plugin:prettier-vue/recommended",
    "plugin:vue/essential",
    "plugin:vue/strongly-recommended"
    //"plugin:vue/recommended"
  ],
  root: true,

  env: {
    node: true
  },

  parserOptions: {
    parser: "@babel/eslint-parser"
  },

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/html-self-closing": 0,
    "vue/singleline-html-element-content-newline": 0,
    "vue/max-attributes-per-line": 0
  }
};
