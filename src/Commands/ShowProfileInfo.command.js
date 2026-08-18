const LoadAllInstalationProfiles = require("../Helpers/LoadAllInstalationProfiles")

/*
 * Este comando mantinha a própria lista de perfis -- `dev-minimal`,
 * `dev-standard`, `minimal`, `standard` -- e nenhum desses arquivos existe mais:
 * os perfis foram renomeados para `github-release-*` e `dev-localfs-*`. Um
 * `require` de arquivo inexistente não devolve "perfil não encontrado", derruba
 * o comando com MODULE_NOT_FOUND antes de qualquer verificação.
 *
 * A lista agora sai de LoadAllInstalationProfiles, a mesma que o `list-profiles`
 * usa. Duas listas do mesmo conjunto divergem -- foi o que aconteceu aqui.
 *
 * Os nomes dos campos também estavam defasados: o perfil descreve
 * `namespace`, `sourceType` e `executablesToInstall`, e este comando lia
 * `repositoryNamespace`, `repositorySourceType`, `repositoryPath` e
 * `appsToInstall`. Todos saíam como `undefined`.
 */

const Colorir = (codigo, texto) => `\x1b[${codigo}m${texto}\x1b[0m`

const ShowProfileInfoCommand = async ({ profile }) => {

    const perfis = LoadAllInstalationProfiles()
    const conteudo = perfis[profile]

    if (!conteudo) {
        Log.message("ShowProfileInfo", Colorir(31, `Perfil "${profile}" não encontrado.`))
        Log.message("ShowProfileInfo", Colorir(33, `Disponíveis: ${Object.keys(perfis).join(", ")}`))
        return
    }

    Log.message("ShowProfileInfo", Colorir(33, `Perfil: ${profile}`))
    Log.message("ShowProfileInfo", Colorir(32, `Diretório de instalação: ${conteudo.installationDataDir}`))
    Log.message("ShowProfileInfo", Colorir(32, "Repositórios a instalar:"))

    conteudo.repositoriesToInstall.forEach(({ namespace, sourceType, executablesToInstall }) => {

        Log.message("ShowProfileInfo", Colorir(34, `    ${namespace}`))
        Log.message("ShowProfileInfo", Colorir(34, `      fonte: ${sourceType}`))

        const executaveis = executablesToInstall || []

        if (executaveis.length === 0) {
            Log.message("ShowProfileInfo", Colorir(90, "      executáveis: nenhum"))
            return
        }

        Log.message("ShowProfileInfo", Colorir(35, `      executáveis (${executaveis.length}):`))
        executaveis.forEach((executavel) => Log.message("ShowProfileInfo", `        ${executavel}`))
    })
}

module.exports = ShowProfileInfoCommand
