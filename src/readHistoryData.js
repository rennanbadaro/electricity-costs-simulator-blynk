/**
 * Import da biblioteca request utilizada para realizar requisicoes HTTP
 */
const request = require('request-promise');

/**
 * Import do modulo de configuracoes e modulo auxiliar para decodificacao de GZIP
 */
const blynkConfig = require('../config/blynk');
const parseGzipData = require('./helper/parseGzipData');

/**
 * Extracao de dados de conexao, pinos virtuais mapeados no app e metodos auxiliares para
 * para obtencao de URLs para interacao com o servidor Blynk
 */
const { connection, virtualPins, urls } = blynkConfig;
const dataUrl = urls.getHistoryData(connection.token, virtualPins.activePower);

const requestOpts = {
  method: 'GET',                   // metodo a requisicao HTTP
  encoding: null,                  // nao utilizar nenhum encoding padrao
  gzip: true,                      // aceitar retorno GZIP
  resolveWithFullResponse: true    // retornar todos os dados da resposta da requisicao
};

/**
 * Funcao principal do modulo para obter dados de historico do servidor Blynk
 */
async function readHistoryData() {
  /**
   * Realizando chamada HTTP com as opcoes definidas anteriormente e decodificando o payload GZIP
   * recebido do servidor Blynk respectivamente
   */
  const { body } = await request(dataUrl, requestOpts);
  const parsedResults = parseGzipData(body);

  return parsedResults;
}

/**
 * exportando do modulo somente a funcao principal readHistoryData
 */
module.exports = {
  readHistoryData
};
