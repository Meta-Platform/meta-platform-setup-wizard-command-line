const path = require("path")

const SetupCLIScriptLoader = require("meta-platform-cli-script-loader-library/SetupCLIScriptLoader")

const Updater = require("../Helpers/Updater")

const WIZARD_CONFIGS = require("../Configs/app-params-dev.json")
const NPM_DEPENDENCIES =  require("../Configs/npm-dependencies.json")
const META_PLATFORM_DEPENDENCIES = require("../Configs/meta-platform-dependencies.json")

const UpdateCommand = async ({ profile, installationPath }) => {   

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
    await Updater({ 
        profile, 
        installationPath: absoluteInstallationPath,
        LoaderScript
    })
}

module.exports = UpdateCommand