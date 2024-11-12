const EventEmitter = require('events')

const ECOSYSTEM_DEFAULTS = require("../../configs/ecosystem-defaults.json")
const NPM_DEPENDENCIES =  require("../../configs/npm-dependencies.json")
const REPOSITORY_SOURCES = require("../../configs/repository-sources.json")

const LoadAllInstalationProfiles = require("../Helpers/LoadAllInstalationProfiles")

const BuildRepositoriesInstallData = require("./BuildRepositoriesInstallData")

const Installer = async ({ 
    profile, 
    installationPath,
    LoaderScript
}) => {
    
    const PrintDataLog = LoaderScript("print-data-log.lib/src/PrintDataLog")
    const InstallEcosystemByProfile = LoaderScript("ecosystem-install-utilities.lib/src/InstallEcosystemByProfile")

    const loggerEmitter = new EventEmitter()
	loggerEmitter.on("log", (dataLog) => PrintDataLog(dataLog, "Installer"))

    const installationProfiles = LoadAllInstalationProfiles()
    const instalationData = installationProfiles[profile]

    const { repositoriesToInstall, installationDataDir } = instalationData

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