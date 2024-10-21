const EventEmitter = require('events')

const ECOSYSTEM_DEFAULTS = require("../../configs/ecosystem-defaults.json")
const NPM_DEPENDENCIES =  require("../../configs/npm-dependencies.json")

const LoadAllInstalationProfiles = require("../Helpers/LoadAllInstalationProfiles")

const Installer = async ({ 
    profile, 
    installationPath,
    LoaderScript
}) => {
    
    const PrintDataLog = LoaderScript("print-data-log.lib/src/PrintDataLog")
    const InstallEcosystemByProfile = LoaderScript("ecosystem-install-utilities.lib/src/InstallEcosystemByProfile")

    const installationProfiles = LoadAllInstalationProfiles()
    
    const loggerEmitter = new EventEmitter()
	loggerEmitter.on("log", (dataLog) => PrintDataLog(dataLog, "Installer"))

    try{
        await InstallEcosystemByProfile({
            ecosystemDefaults : ECOSYSTEM_DEFAULTS,
            npmDependencies : NPM_DEPENDENCIES,
            installationProfile : installationProfiles[profile],
            profile,
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