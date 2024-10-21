const path = require("path")

const SetupCLIScriptLoader = require("meta-platform-cli-script-loader-library/SetupCLIScriptLoader")
const APP_PARAMS = require("../../configs/app-params-dev.json")
const NPM_DEPENDENCIES =  require("../../configs/npm-dependencies.json")
const META_PLATFORM_DEPENDENCIES = require("../../configs/meta-platform-dependencies.json")

const Installer = require("../Helpers/Installer")

const InstallCommand = async ({ profile, installationPath }) => {   

    const LoaderScript = await SetupCLIScriptLoader( {
        npmDependenciesDirname   : APP_PARAMS.NPM_DEPENDENCIES_DIRNAME,
        npmDependencies          : NPM_DEPENDENCIES,
        metaPlatformDependencies : META_PLATFORM_DEPENDENCIES,
        sourceType               : APP_PARAMS.MINIMUM_REPO_SOURCE_TYPE,
        repoPath                 : APP_PARAMS.MINIMUM_REPO_PATH,
        repoNamespace            : APP_PARAMS.MINIMUM_REPO_NAMESPACE,
        fileId                   : APP_PARAMS.MINIMUM_REPO_FILE_ID
    })

    const absoluteInstallationPath = installationPath && path.resolve(process.cwd(), installationPath)
    await Installer({ 
        profile, 
        installationPath: absoluteInstallationPath,
        LoaderScript
    })
}

module.exports = InstallCommand