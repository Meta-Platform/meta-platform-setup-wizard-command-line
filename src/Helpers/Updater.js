const EventEmitter = require('events')

const ECOSYSTEM_DEFAULTS = require("../../configs/ecosystem-defaults.json")
const NPM_DEPENDENCIES =  require("../../configs/npm-dependencies.json")
const REPOSITORY_SOURCES = require("../../configs/repository-sources.json")

const LoadAllInstalationProfiles = require("../Helpers/LoadAllInstalationProfiles")

const BuildRepositoriesInstallData = require("./BuildRepositoriesInstallData")

const Updater = async ({ 
    profile, 
    installationPath,
    LoaderScript
}) => {
    
    const PrintDataLog = LoaderScript("print-data-log.lib/src/PrintDataLog")
    const UpdateEcosystemByProfile = LoaderScript("ecosystem-install-utilities.lib/src/UpdateEcosystemByProfile")

    const loggerEmitter = new EventEmitter()
	loggerEmitter.on("log", (dataLog) => PrintDataLog(dataLog, "Updater"))

    const installationProfiles = LoadAllInstalationProfiles()
    const instalationData = installationProfiles[profile]

    const { repositoriesToInstall, installationDataDir } = instalationData

    const repositoriesInstallData = 
        BuildRepositoriesInstallData({ repositoriesToInstall, sources: REPOSITORY_SOURCES})   

    try{
        await UpdateEcosystemByProfile({
            ecosystemDefaults : ECOSYSTEM_DEFAULTS,
            npmDependencies : NPM_DEPENDENCIES,
            profile,
            installationDataDir,
            repositoriesInstallData,
            installationPath,
            loggerEmitter
        })
    } catch(e){
       
        loggerEmitter && loggerEmitter.emit("log", {
            sourceName: "Updater",
            type: "error",
            message: e
        })

        loggerEmitter && loggerEmitter.emit("log", {
            sourceName: "Updater",
            type: "error",
            message: `A atualização cancelada!`
        })

        throw e
    }
}

module.exports = Updater