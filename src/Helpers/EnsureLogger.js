/*
 * Garante que `globalThis.Log` exista antes do primeiro comando.
 *
 * Quem instalava o logger era o SetupCLIScriptLoader, e ele só é chamado por
 * `install` e `update`. Todo comando fora desse caminho -- `list-profiles`,
 * `show-profile` -- chamava `Log.message` num global inexistente e morria com
 * `ReferenceError: Log is not defined` antes da primeira linha de saída.
 * Justamente os comandos que existem para o usuário DESCOBRIR o que instalar.
 *
 * É a mesma classe de falha que o ReportFailure documenta: `Log` ausente troca
 * o resultado real por um ReferenceError, e o motivo verdadeiro se perde.
 *
 * A ordem é deliberada:
 *
 * 1. Se já existe um Log, não mexe -- pode ser o canônico.
 * 2. Tenta o logger mínimo do `cli-script-loader`, que implementa o formato do
 *    Logging Standard. Nem toda versão publicada da lib o traz (a 0.0.9 não
 *    traz), então a ausência não pode ser fatal.
 * 3. Cai para um encaminhador de três linhas sobre o stdout. Não é o formato da
 *    norma, e não pretende ser: é o que impede um comando de listagem de morrer
 *    por falta de logger.
 *
 * Em qualquer dos casos a marca `minimal` fica no global, para que o
 * InstallLogger substitua pela `logger.lib` canônica quando o ecossistema
 * estiver disponível.
 */

const GLOBAL_MARK = Symbol.for("meta-platform.logger.globalLogger")

const LEVELS = ["trace", "debug", "info", "message", "warn", "error", "fatal"]

const _InstalarEncaminhadorSimples = () => {

    const Escrever = (nivel) => (source, message) => {
        try {
            const texto = message === undefined ? source : message
            const alvo  = (nivel === "error" || nivel === "fatal" || nivel === "warn")
                ? process.stderr
                : process.stdout

            alvo.write(`${texto}\n`)
        } catch (erro) {
            /* Log é observabilidade, não caminho crítico. */
        }
    }

    const logger = LEVELS.reduce((construido, nivel) => ({ ...construido, [nivel]: Escrever(nivel) }), {})

    logger.source    = () => logger
    logger.child     = () => logger
    logger.Flush     = async () => {}
    logger.FlushSync = () => {}
    logger.Close     = async () => {}
    logger.minimal   = true

    globalThis.Log = logger

    Object.defineProperty(globalThis, GLOBAL_MARK, {
        value        : { minimal: true, UninstallBridge: () => {}, UnregisterExitFlush: () => {} },
        configurable : true,
        enumerable   : false,
        writable     : false
    })

    return logger
}

const EnsureLogger = ({ origin = "wizard" } = {}) => {

    if (globalThis.Log && typeof globalThis.Log.message === "function") {
        return globalThis.Log
    }

    try {
        const InstallMinimalGlobalLogger = require("cli-script-loader/src/MinimalLogger")
        return InstallMinimalGlobalLogger({ origin })
    } catch (erro) {
        /* versão da lib sem o logger mínimo — segue para o encaminhador simples */
    }

    return _InstalarEncaminhadorSimples()
}

module.exports = EnsureLogger
