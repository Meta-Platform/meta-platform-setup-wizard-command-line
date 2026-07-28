const EventEmitter = require('events')

const ECOSYSTEM_DEFAULTS = require("../../configs/ecosystem-defaults.json")
const NPM_DEPENDENCIES =  require("../../configs/npm-dependencies.json")
const REPOSITORY_SOURCES = require("../../configs/repository-sources.json")

const LoadAllInstalationProfiles = require("../Helpers/LoadAllInstalationProfiles")

const BuildRepositoriesInstallData = require("./BuildRepositoriesInstallData")
const InstallLogger = require("./InstallLogger")

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

    const loggerEmitter = new EventEmitter()
	loggerEmitter.on("log", (dataLog) =>
		Log[LEVEL_BY_TYPE[dataLog.type] || "info"](dataLog.sourceName, dataLog.message))

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
            installationPath,
            loggerEmitter
        })
    } catch(e){
        loggerEmitter && loggerEmitter.emit("log", {
            sourceName: "Installer",
            type: "error",
            message: `A instalação cancelada!`
        })
        console.error(e)
    }
    
}

module.exports = Installer