/**
 * Modulo auxiliar para decodificar streams GZIP recebidas das responses
 * de historico de dados do servidor Blynk
 */
const zlib = require('zlib');
const moment = require('moment');

module.exports = gzip => {
  /**
   * Decodificando a stream GZIP
   */
  const unziped = zlib.unzipSync(gzip).toString();

  /**
   * Fragmentando a stream que foi decodificada e convertida para string em toda quebra de linha
   * resultando num array contendo valor de leitura e timestamp UNIX da leitura
   */
  const result = unziped.split('\n');
  result.pop(); // retirado o ultimo item do array que é uma string vazia

  /**
   * Retornamos ao fim um array devidamente transaformado contendo objetos com o seguinte corpo
   * {
   *    value: valor da leitura
   *    date: data da leitura
   * }
  */
  return result
  /**
   * iteramos sobre os resultados transformando o timestamp UNIX num objeto da biblioteca MOMENT
   * para facilitar o manuseio e calculo de datas
   */
    .map(data => {
      const parsedData = data.split(',');
      parsedData[1] = moment(+parsedData[1]);
      parsedData.pop();
      return parsedData;
    })
    /**
     * consolidamos os dados num objeto contendo as chaves "value" e "date" devidamente processados
     */
    .reduce((acc, curr) => {
      acc.push({
        value: +parseFloat(curr[0]).toFixed(2),
        date: curr[1]
      });

      return acc;
    }, []);
};
