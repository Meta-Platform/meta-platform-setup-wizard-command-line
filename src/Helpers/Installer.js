const EventEmitter = require('events')

const ECOSYSTEM_DEFAULTS = require("../Configs/ecosystem-defaults.json")
const NPM_DEPENDENCIES =  require("../Configs/npm-dependencies.json")

const Installer = async ({ 
    profile, 
    installationPath,
    LoaderScript
}) => {
    
    const PrintDataLog = LoaderScript("print-data-log.lib/src/PrintDataLog")
    const InstallEcosystemByProfile = LoaderScript("ecosystem-install-utilities.lib/src/InstallEcosystemByProfile")

    const INSTALL_PROFILES = {
        "dev-minimal"  : require("../InstallationProfiles/dev-minimal.install.json"),
        "dev-standard" : require("../InstallationProfiles/dev-standard.install.json"),
        "minimal"      : require("../InstallationProfiles/minimal.install.json"),
        "standard"     : require("../InstallationProfiles/standard.install.json")
    }
    
    const loggerEmitter = new EventEmitter()
	loggerEmitter.on("log", (dataLog) => PrintDataLog(dataLog))

    await InstallEcosystemByProfile({
        ecosystemDefaults : ECOSYSTEM_DEFAULTS,
        npmDependencies : NPM_DEPENDENCIES,
        installProfile : INSTALL_PROFILES[profile],
        installationPath,
        loggerEmitter
    })
}

module.exports = Installer