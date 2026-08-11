const ECOSYSTEM_DEFAULTS = require("../../configs/ecosystem-defaults.json")
const NPM_DEPENDENCIES =  require("../../configs/npm-dependencies.json")
const REPOSITORY_SOURCES = require("../../configs/repository-sources.json")

const LoadAllInstalationProfiles = require("../Helpers/LoadAllInstalationProfiles")

const BuildRepositoriesInstallData = require("./BuildRepositoriesInstallData")
const PrepareRepositorySources    = require("./PrepareRepositorySources")
const InstallLogger = require("./InstallLogger")
const ReportFailure = require("./ReportFailure")

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

    /* Mesma preparação da instalação: o caminho de workspace do catálogo é um
       placeholder, e resolvê-lo aqui também mantém `update` e `install` usando
       exatamente a mesma fonte para o mesmo perfil. */
    const repositoriesInstallData =
        BuildRepositoriesInstallData({
            repositoriesToInstall,
            sources: PrepareRepositorySources({ repositoriesToInstall, sources: REPOSITORY_SOURCES })
        })

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

        /* Relato protegido: sem isto, um `Log` ainda não instalado transformava
           a falha da atualização em "Log is not defined" e escondia a causa. */
        ReportFailure("Updater", "A atualização cancelada!", e)

        throw e
    }
}

module.exports = Updater