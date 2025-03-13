const LoadAllInstalationProfiles = () => {

    const INSTALLATION_PROFILES = {
        "release-minimal"           : require("../../installation-profiles/github-release-minimal.install.json"),
        "release-standard"         : require("../../installation-profiles/github-release-standard.install.json"),
        "localfs-release-standard" : require("../../installation-profiles/localfs-release-standard.install.json")
    }

    return INSTALLATION_PROFILES
}

module.exports = LoadAllInstalationProfiles