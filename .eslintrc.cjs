module.exports = {
    "env": {
        "es2021": true
    },
    "extends": [
        // "strapi/typescript",
        "eslint-plugin-node",
        "plugin:@typescript-eslint/recommended"
    ],
    "parserOptions": {
        "parser": "@typescript-eslint/parser",
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "never"
        ],
    }
}
