const ECOSYSTEM_DEFAULTS = require("../../configs/ecosystem-defaults.json")
const NPM_DEPENDENCIES =  require("../../configs/npm-dependencies.json")
const REPOSITORY_SOURCES = require("../../configs/repository-sources.json")

const LoadAllInstalationProfiles = require("../Helpers/LoadAllInstalationProfiles")

const BuildRepositoriesInstallData = require("./BuildRepositoriesInstallData")
const PrepareRepositorySources    = require("./PrepareRepositorySources")
const InstallLogger = require("./InstallLogger")
const ReportFailure = require("./ReportFailure")
const ArmTypeScriptResolution = require("./ArmTypeScriptResolution")

const LEVEL_BY_TYPE = { info : "info", success : "message", warning : "warn", error : "error" }

const Installer = async ({ 
    profile, 
    installationPath,
    LoaderScript
}) => {
    
    /* O EssentialRepo é TypeScript: sem isto o require abaixo não encontra o
       arquivo que está lá, e falha sem dizer nada. Ver ArmTypeScriptResolution. */
    ArmTypeScriptResolution(LoaderScript)

    const InstallEcosystemByProfile = LoaderScript("ecosystem-install-utilities.lib/src/InstallEcosystemByProfile")

    const installationProfiles = LoadAllInstalationProfiles()
    const instalationData = installationProfiles[profile]

    if(!instalationData){
        const availableProfiles = Object.keys(installationProfiles).join(", ")
        throw new Error(`Perfil de instalação "${profile}" não encontrado. Perfis disponíveis: ${availableProfiles}`)
    }

    const { repositoriesToInstall, installationDataDir } = instalationData

    /*
     * Substitui o logger mínimo do cli-script-loader pela lib canônica, agora
     * que o EssentialRepo já está disponível ao LoaderScript. A instalação de
     * um ecossistema passa a deixar histórico em disco — até aqui ela só
     * existia enquanto o terminal estivesse aberto.
     */
    InstallLogger({ LoaderScript, installationDataDir, ecosystemDefaults: ECOSYSTEM_DEFAULTS, origin: "wizard" })

    /*
     * As MESMAS fontes alimentam a instalação e o `sources.json` do ecossistema:
     * só os repositórios deste perfil, já com o caminho de workspace resolvido.
     * Usar o catálogo cru aqui registrava, numa instalação de usuário, fontes de
     * repositórios que o perfil não instala, apontando para diretórios que só
     * existem na máquina de quem desenvolve a plataforma.
     */
    const repositorySources = PrepareRepositorySources({ repositoriesToInstall, sources: REPOSITORY_SOURCES })

    const repositoriesInstallData =
        BuildRepositoriesInstallData({ repositoriesToInstall, sources: repositorySources})

    try{
        await InstallEcosystemByProfile({
            ecosystemDefaults : ECOSYSTEM_DEFAULTS,
            npmDependencies : NPM_DEPENDENCIES,
            initialRepositorySource: repositorySources,
            profile,
            installationDataDir,
            repositoriesInstallData,
            installationPath
        })
    } catch(e){
        /* Relato protegido: sem isto, um `Log` ainda não instalado transformava
           a falha da instalação em "Log is not defined" e escondia a causa. */
        ReportFailure("Installer", "A instalação cancelada!", e)

        /*
         * E a falha PROPAGA. Sem isto, `mywizard install` relatava o erro e saía
         * com 0 — quem chamou seguia sobre uma instalação incompleta.
         *
         * O custo disso foi medido: no build 186 da plataforma VirtualDesk a
         * instalação foi interrompida, o wizard devolveu sucesso, o Dockerfile
         * avançou e só quebrou dois passos depois, em
         * `repo register source ... returned a non-zero code: 127` — "comando não
         * encontrado", porque o executável nunca chegou a ser criado. O sintoma
         * apontava para o repo; o problema estava na instalação.
         *
         * `Updater.js` já propagava; aqui era a assimetria.
         */
        throw e
    }

}

module.exports = Installer