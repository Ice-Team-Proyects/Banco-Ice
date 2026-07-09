// client-userICE/metro.config.cjs
// CommonJS a propósito: Metro carga su config con require(), y el package.json
// del proyecto declara "type": "module".
const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);
