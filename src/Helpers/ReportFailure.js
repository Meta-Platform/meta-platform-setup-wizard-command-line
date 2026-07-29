/*
 * Relata uma falha sem NUNCA ser a causa de outra.
 *
 * Por que existe: `globalThis.Log` é instalado a partir da `logger.lib` do
 * EssentialRepo (ver InstallLogger.js), e essa instalação pode simplesmente não
 * acontecer — o wizard roda ANTES de o ecossistema estar instalado, e num
 * EssentialRepo anterior à lib não há o que carregar. Um `catch` que chama
 * `Log.error` nessa situação troca a exceção original por
 * `ReferenceError: Log is not defined` e o motivo real da falha se perde.
 *
 * Foi exatamente o que aconteceu em 29/07/2026: o `mywizard install
 * release-standard` passou a morrer dentro do build de imagem do VirtualDesk com
 * `Log is not defined`, e a causa verdadeira — o que falhou em
 * InstallEcosystemByProfile — nunca chegou a ser impressa. Mesmo padrão do
 * VDRP-252 no package-executor.
 *
 * A ordem aqui é deliberada: tenta o logger canônico, e o stderr é o último
 * recurso que não pode faltar. Toda tentativa é protegida, porque relatar erro
 * não tem o direito de derrubar o processo.
 */
const ReportFailure = (origin, message, error) => {

    try {
        if (globalThis.Log && typeof globalThis.Log.error === "function") {
            if (message) globalThis.Log.error(origin, message)
            if (error)   globalThis.Log.error(origin, error)
            return
        }
    } catch (loggerError) {
        /* logger indisponível ou quebrado — cai para o stderr abaixo */
    }

    try {
        if (message) process.stderr.write(`[${origin}] ${message}\n`)
        if (error)   process.stderr.write(`[${origin}] ${(error && error.stack) || error}\n`)
    } catch (stderrError) {
        /* sem stderr não há mais para onde ir; engolir é melhor que mascarar */
    }
}

module.exports = ReportFailure
