/*
 * Ensina o carregador a enxergar `.ts` — antes de ele precisar.
 *
 * O `LoaderScript` do cli-script-loader resolve um módulo do EssentialRepo com
 * um `require` comum, e o `require` do Node só tenta `.js`, `.json` e `.node`.
 * Enquanto o EssentialRepo era JavaScript isso bastava. Ele foi convertido para
 * TypeScript, e a plataforma passou a apagar os tipos em tempo de carga por um
 * hook de resolução — que alguém precisa instalar no processo.
 *
 * Ninguém instalava aqui. O efeito era desproporcional à causa: qualquer
 * `mywizard install` sobre um release atual do EssentialRepo morria em
 *
 *     Cannot find module '<...>/ecosystem-install-utilities.lib/src/InstallEcosystemByProfile'
 *
 * com o arquivo presente no disco — como `InstallEcosystemByProfile.ts`. E a
 * falha era MUDA: o `require` acontece fora do try do Installer, então o relato
 * protegido não roda, e o `.catch` do executável apenas marca `exitCode = 1`.
 * Quem chamava via Docker via o build parar num `RUN ./mywizard install` sem
 * uma linha de erro, e o sintoma aparecia longe — em passos seguintes, como
 * "repo: not found".
 *
 * `module-resolution.lib` já constava de `meta-platform-dependencies.json`
 * desde a conversão: a dependência estava declarada, só não era carregada.
 *
 * O `register` é deliberadamente JavaScript no EssentialRepo, e permanentemente:
 * é o único módulo que precisa carregar ANTES de existir resolução de `.ts`.
 * Ele é idempotente — marca o processo e não empilha hooks em chamadas
 * repetidas —, então armar duas vezes não custa nada.
 */

const ArmTypeScriptResolution = (LoaderScript) => {
    LoaderScript("module-resolution.lib/src/register")
    return LoaderScript
}

module.exports = ArmTypeScriptResolution
