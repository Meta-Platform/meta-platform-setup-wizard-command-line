const LoadAllInstalationProfiles = () => {

    const INSTALLATION_PROFILES = {
        "dev-minimal-localfs"     : require("../../installation-profiles/dev-localfs/minimal.install.json"),
        "dev-standard-localfs"    : require("../../installation-profiles/dev-localfs/standard.install.json"),
        "dev-full-localfs"        : require("../../installation-profiles/dev-localfs/full.install.json"),
        "minimal-github-release"  : require("../../installation-profiles/github-release/minimal.install.json"),
        "standard-github-release" : require("../../installation-profiles/github-release/standard.install.json"),
        "minimal-github-repo"     : require("../../installation-profiles/github-repo/minimal.install.json"),
        "standard-github-repo"    : require("../../installation-profiles/github-repo/standard.install.json"),
        "minimal-google-drive"    : require("../../installation-profiles/google-drive/minimal.install.json"),
        "standard-google-drive"   : require("../../installation-profiles/google-drive/standard.install.json")
    }

    return INSTALLATION_PROFILES
}

module.exports = LoadAllInstalationProfiles