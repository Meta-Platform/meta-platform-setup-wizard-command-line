const path = require("path")

const SetupCLIScriptLoader = require("meta-platform-cli-script-loader-library/SetupCLIScriptLoader")

const Installer = require("../Helpers/Installer")

const WIZARD_CONFIGS = require("../Configs/wizard-config-dev.json")
const NPM_DEPENDENCIES =  require("../Configs/npm-dependencies.json")
const META_PLATFORM_DEPENDENCIES = require("../Configs/meta-platform-dependencies.json")

const InstallCommand = async ({ profile, installationPath }) => {   

    const LoaderScript = await SetupCLIScriptLoader( {
        npmDependenciesDirname   : WIZARD_CONFIGS.NPM_DEPENDENCIES_DIRNAME,
        npmDependencies          : NPM_DEPENDENCIES,
        metaPlatformDependencies : META_PLATFORM_DEPENDENCIES,
        sourceType               : WIZARD_CONFIGS.MINIMUM_REPO_SOURCE_TYPE,
        repoPath                 : WIZARD_CONFIGS.MINIMUM_REPO_PATH,
        repoNamespace            : WIZARD_CONFIGS.MINIMUM_REPO_NAMESPACE,
        fileId                   : WIZARD_CONFIGS.MINIMUM_REPO_FILE_ID
    })

    const absoluteInstallationPath = installationPath && path.resolve(process.cwd(), installationPath)
    await Installer({ 
        profile, 
        installationPath: absoluteInstallationPath,
        LoaderScript
    })
}

module.exports = InstallCommand