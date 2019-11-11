/**
 * Import da biblioteca request utilizada para realizar requisicoes HTTP, manipulacao de datas e
 * execucao de processos de forma programatica, respectivamente
 */
const request = require('request-promise');
const moment = require('moment');
const { CronJob } = require('cron');

/**
 * Import do modulo da função de leitura do historico de dados, auxiliar para adicao de impostos e
 *  configuracoes, respectivamente
 */
const { readHistoryData } = require('./readHistoryData');
const addTaxes = require('./helper/addTaxes');
const { blynk: blynkConfig, fees } = require('../config');

/**
 * Funcao de entrada do programa
 */
async function main() {
  /**
   * Realiza chamada de funcao do modulo de leitura de historico onde sera realizada
   * uma chamada http para obter os dados do servidor Blynk
   */
  const result = await readHistoryData();

  /**
   * Filtrados os os registros com data do mes corrent diferentes de zero
   */
  const monthRegistersDiffThanZero = result
    .filter(register => {
      const startOfTheMonth = moment().startOf('month');
      const isFromCurrentMonth = startOfTheMonth.diff(register.date) <= 0
      
      return isFromCurrentMonth;
    })
    .filter(register => register.value > 0.0);
    /**
     * Numero total de registros filtrados
     */
    const totalRegisters = monthRegistersDiffThanZero.length;

  /**
   * Realizado o calculo médio dos valores de leitura arredondando o resultado
   * e fixando em duas casas decimais
   */
  const avgValue = (
    monthRegistersDiffThanZero.reduce((acc, curr) => acc + curr.value, 0) /
    totalRegisters
  ).toFixed(2);

  /**
   * Apenas para fins de log, identificamos o valor maximo registrado
   */
  const maxRegisteredValue = Math.max(
    ...monthRegistersDiffThanZero.map(r => r.value)
  );

  /**
   * O intervalo dos dados do servidor sao de minuto a minuto, sendo estimamos o numero de horas
   * de atividade e em seguida o valor de kWh (media das leituras * numero de horas de atividade)
   */
  const estimatedActiveHours = parseFloat((totalRegisters / 60));
  const estimatedKWh = parseFloat(((avgValue / 1000) * estimatedActiveHours));

  const estimatedCostsNoTaxes = estimatedKWh * fees.TE + estimatedKWh * fees.TUSD;
  const totalEstimatedCosts = addTaxes({ estimatedCostsNoTaxes, estimatedKWh });
  /**
   * Log dos valores calculados
   */
  console.info(`
    Max value => ${maxRegisteredValue}
    Average Active Power => ${avgValue}
    Estimated active hours => ${estimatedActiveHours}
    Estimated kWH => ${estimatedKWh}
    Estimed costs without taxes => ${estimatedCostsNoTaxes}
    Estimed costs with taxes => ${totalEstimatedCosts}
  `);

  /**
   * Extracao de dados de configuracao para conexao, pinos virtuais mapeados no app bem
   * como metodos auxiliares para obtencao da url que sera necessaria para enviar os dados
   */
  const { connection, urls, virtualPins } = blynkConfig;

  /**
   * Uso do metodo auxiliar para gerar a URL que sera feita a request para enviar os dados dados
   * de registro ao servidor Blynk
   */
  const setPinUrl = urls.setPinValue(
    connection.token,
    virtualPins.estimatedCosts
  );

  /**
   * Objecto de opcoes a serem passados para a biblioteca request para fazer a requisicao HTTP
   */
  const requestOpts = {
    method: 'PUT',                   // metodo da requisicao HTTTP
    body: [totalEstimatedCosts.toFixed(2)],     // corpo da requisicao
    json: true,                      // automaticamente converter body para json
    resolveWithFullResponse: true    // retornar todos os dados da resposta da requisicao
  };

  /**
   * Chamada HTTP ao servidor Blynk para enviar os dados estimados de custo
   */
  await request(setPinUrl, requestOpts);

  /**
   * Log informativo da data e horario em que a funcao terminou a execucao
   */
  console.info(`Last run: ${moment().format('DD/MM/YYYY HH:mm:ss')}`)
}

/**
 * Instancia do Cron que sera executada repetidamente conforme as configuracoes da instancia
 * detalhadas abaixo. A biblioteca utiliza o padrao cron para definicaodos periodos
 * Para mais detalhes: https://www.npmjs.com/package/cron
 */
new CronJob({
  cronTime: '*/30 * * * * *',      // Definicao intervalo do cron - a cada 30s
  onTick: main,                    // funcao a ser executada a cada intervalo
  start: true,                     // define que a funcao rodara assim que o programa for iniciado
  timeZone: 'America/Sao_Paulo'    // timezone de Sao Paulo
});
