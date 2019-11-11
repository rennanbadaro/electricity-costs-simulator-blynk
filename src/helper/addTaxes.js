/**
 * Modulo para calculo da estimativa de custos incluindo impostos
 */
module.exports = ({ estimatedCostsNoTaxes, estimatedKWh }) => {
  /**
   * Dados extraidos da fonte https://www.eneldistribuicaosp.com.br/para-sua-casa/impostos-e-outros-encargos
   * Utilizados coeficientes de CONFIS/PIS referente a out/2019
   */
  const CONFINS = 0.0397;
  const PIS = 0.0086;
  let ICMS = 0;

  /**
   * Condicionais para o valor variavel de ICMS
   * 0 para kWh ate 90
   * 12% para kWh de 91 ate 200
   * 25% para kWh acima 201
   */
  if (estimatedKWh <= 90) {
    ICMS = 0.0;
  } else if (estimatedKWh > 90 && estimatedKWh <= 200) {
    ICMS = 0.12;
  } else if (estimatedKWh > 200) {
    ICMS = 0.25
  }

  /**
   * Log da % dos impostos cobrados
   */
  console.log(`
    ICMS: ${ICMS},
    PIS: ${PIS},
    CONFINS: ${CONFINS}
    TOTAL TAXES: ${1-CONFINS-PIS-ICMS}
  `)

  /**
   * Calculo do valor total incluindo impostos
   */
  return estimatedCostsNoTaxes / (1 - CONFINS - PIS - ICMS);
};
