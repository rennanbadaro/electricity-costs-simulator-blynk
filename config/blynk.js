/**
 * Modulo de mapeamento de configuracoes
 */
module.exports = Object.freeze({
  /**
   * mapeamento dos pinos virtuais do app Blynk com hardware
   */
  virtualPins: {
    currentRMS: 'V0',
    voltageRMS: 'V1',
    activePower: 'V2',
    reactivePower: 'V3',
    apparentPower: 'V4',
    powerFactor: 'V5',
    frequency: 'V6',
    temperature: 'V7',
    estimatedCosts: 'V25',
    load: 'V11'
  },

  /**
   * Token autenticacao do app
   */
  connection: {
    token: 'blynk-auth-token'
  },

  /**
   * Funcoes auxiliares para obter URLs para interacao com o servidor Blynk
   */
  urls: {
    appConnected: token => `http://blynk-cloud.com/${token}/isAppConnected`,
    notifyApp: token => `http://blynk-cloud.com/${token}/notify`,
    getPinValue: (token, pin) => `http://blynk-cloud.com/${token}/get/${pin}`,
    setPinValue: (token, pin) => `http://blynk-cloud.com/${token}/update/${pin}`,
    getHistoryData: (token, pin) => `http://blynk-cloud.com/${token}/data/${pin}`
  },
});
