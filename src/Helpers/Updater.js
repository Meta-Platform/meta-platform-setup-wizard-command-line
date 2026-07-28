const ECOSYSTEM_DEFAULTS = require("../../configs/ecosystem-defaults.json")
const NPM_DEPENDENCIES =  require("../../configs/npm-dependencies.json")
const REPOSITORY_SOURCES = require("../../configs/repository-sources.json")

const LoadAllInstalationProfiles = require("../Helpers/LoadAllInstalationProfiles")

const BuildRepositoriesInstallData = require("./BuildRepositoriesInstallData")
const InstallLogger = require("./InstallLogger")

const LEVEL_BY_TYPE = { info : "info", success : "message", warning : "warn", error : "error" }

const Updater = async ({ 
    profile, 
    installationPath,
    LoaderScript
}) => {
    
    const UpdateEcosystemByProfile = LoaderScript("ecosystem-install-utilities.lib/src/UpdateEcosystemByProfile")

    const installationProfiles = LoadAllInstalationProfiles()
    const instalationData = installationProfiles[profile]

    if(!instalationData){
        const availableProfiles = Object.keys(installationProfiles).join(", ")
        throw new Error(`Perfil de instalação "${profile}" não encontrado. Perfis disponíveis: ${availableProfiles}`)
    }

    const { repositoriesToInstall, installationDataDir } = instalationData

    /* Ver a nota em Installer.js: a lib canônica assume o lugar da mínima. */
    InstallLogger({ LoaderScript, installationDataDir, ecosystemDefaults: ECOSYSTEM_DEFAULTS, origin: "wizard" })

    const repositoriesInstallData = 
        BuildRepositoriesInstallData({ repositoriesToInstall, sources: REPOSITORY_SOURCES})   

    try{
        await UpdateEcosystemByProfile({
            ecosystemDefaults : ECOSYSTEM_DEFAULTS,
            npmDependencies : NPM_DEPENDENCIES,
            profile,
            installationDataDir,
            repositoriesInstallData,
            installationPath
        })
    } catch(e){
       
        Log.error("Updater", e)

        Log.error("Updater", `A atualização cancelada!`)

        throw e
    }
}

module.exports = Updater