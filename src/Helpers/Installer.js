const ECOSYSTEM_DEFAULTS = require("../../configs/ecosystem-defaults.json")
const NPM_DEPENDENCIES =  require("../../configs/npm-dependencies.json")
const REPOSITORY_SOURCES = require("../../configs/repository-sources.json")

const LoadAllInstalationProfiles = require("../Helpers/LoadAllInstalationProfiles")

const BuildRepositoriesInstallData = require("./BuildRepositoriesInstallData")
const InstallLogger = require("./InstallLogger")
const ReportFailure = require("./ReportFailure")

const LEVEL_BY_TYPE = { info : "info", success : "message", warning : "warn", error : "error" }

const Installer = async ({ 
    profile, 
    installationPath,
    LoaderScript
}) => {
    
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

    const repositoriesInstallData = 
        BuildRepositoriesInstallData({ repositoriesToInstall, sources: REPOSITORY_SOURCES})   

    try{
        await InstallEcosystemByProfile({
            ecosystemDefaults : ECOSYSTEM_DEFAULTS,
            npmDependencies : NPM_DEPENDENCIES,
            initialRepositorySource: REPOSITORY_SOURCES,
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