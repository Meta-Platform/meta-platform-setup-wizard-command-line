const path = require("path")

const SetupCLIScriptLoader = require("cli-script-loader/SetupCLIScriptLoader")
const APP_PARAMS = require("../../configs/app-params-release.json")
const NPM_DEPENDENCIES =  require("../../configs/npm-dependencies.json")
const META_PLATFORM_DEPENDENCIES = require("../../configs/meta-platform-dependencies.json")

const Updater = require("../Helpers/Updater")

const UpdateCommand = async ({ profile, installationPath }) => {   

    const LoaderScript = await SetupCLIScriptLoader( {
        npmDependenciesDirname   : APP_PARAMS.NPM_DEPENDENCIES_DIRNAME,
        npmDependencies          : NPM_DEPENDENCIES,
        metaPlatformDependencies : META_PLATFORM_DEPENDENCIES,
        sourceType               : APP_PARAMS.MINIMUM_REPO_SOURCE_TYPE,
        repoPath                 : APP_PARAMS.MINIMUM_REPO_PATH,
        repoNamespace            : APP_PARAMS.MINIMUM_REPO_NAMESPACE,
        repositoryOwner          : APP_PARAMS.MINIMUM_REPO_GITHUB_OWNER,
        repositoryName           : APP_PARAMS.MINIMUM_REPO_GITHUB_NAME,
        fileId                   : APP_PARAMS.MINIMUM_REPO_FILE_ID
    })

    const absoluteInstallationPath = installationPath && path.resolve(process.cwd(), installationPath)
    await Updater({ 
        profile, 
        installationPath: absoluteInstallationPath,
        LoaderScript
    })
}

module.exports = UpdateCommand