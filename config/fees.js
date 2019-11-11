/**
 * Modulo de tarifas para o calculo da consumo estimado
 */

module.exports = Object.freeze({
  /**
   * Tarifas de Uso do Sistema de Distribuicao (TUSD) e de Energia (TE) registradas na 
   * RESOLUÇÃO HOMOLOGATÓRIA Nº 2.568 validas a partir de 04/07/2019
   * Valores obtidos atraves do portal oficial da ENEL, sendo utilizada a categoria domestica
   * https://www.eneldistribuicaosp.com.br/para-sua-casa/tarifa-de-energia-eletrica
   */
    TE: 0.25588,
    TUSD: 0.25971
});
