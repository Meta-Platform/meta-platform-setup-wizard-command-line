const LoadAllInstalationProfiles = () => {

    const INSTALLATION_PROFILES = {
        "dev-github-release-minimal"  : require("../../installation-profiles/dev-github-release-minimal.install.json"),
        "dev-github-release-standard" : require("../../installation-profiles/dev-github-release-standard.install.json"),
        "dev-localfs-full"            : require("../../installation-profiles/dev-localfs-full.install.json"),
        "dev-localfs-minimal"         : require("../../installation-profiles/dev-localfs-minimal.install.json"),
        "dev-localfs-standard"        : require("../../installation-profiles/dev-localfs-standard.install.json"),
        "github-release-minimal"      : require("../../installation-profiles/github-release-minimal.install.json"),
        "github-release-standard"     : require("../../installation-profiles/github-release-standard.install.json")
    }

    return INSTALLATION_PROFILES
}

module.exports = LoadAllInstalationProfiles