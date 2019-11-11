/**
 * Modulo centralizando o import dos demais modulos de configuracao
 */
const blynk = require('./blynk');
const fees = require('./fees');

module.exports = {
    blynk,
    fees
};
