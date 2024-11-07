const LoadAllInstalationProfiles = () => {

    const INSTALLATION_PROFILES = {
        "dev-github-release-minimal"  : require("../../installation-profiles/dev-github-release-minimal.install.json"),
        "dev-github-release-standard" : require("../../installation-profiles/dev-github-release-standard.install.json"),
        "dev-github-repo-minimal"     : require("../../installation-profiles/dev-github-repo-minimal.install.json"),
        "dev-github-repo-standard"    : require("../../installation-profiles/dev-github-repo-standard.install.json"),
        "dev-google-drive-minimal"    : require("../../installation-profiles/dev-google-drive-minimal.install.json"),
        "dev-google-drive-standar"    : require("../../installation-profiles/dev-google-drive-standar.install.json"),
        "dev-localfs-full"            : require("../../installation-profiles/dev-localfs-full.install.json"),
        "dev-localfs-minimal"         : require("../../installation-profiles/dev-localfs-minimal.install.json"),
        "dev-localfs-standard"        : require("../../installation-profiles/dev-localfs-standard.install.json"),
        "github-release-minimal"      : require("../../installation-profiles/github-release-minimal.install.json"),
        "github-release-standard"     : require("../../installation-profiles/github-release-standard.install.json"),
        "github-repo-minimal"         : require("../../installation-profiles/github-repo-minimal.install.json"),
        "github-repo-standard"        : require("../../installation-profiles/github-repo-standard.install.json"),
        "google-drive-minimal"        : require("../../installation-profiles/google-drive-minimal.install.json"),
        "google-drive-standard"       : require("../../installation-profiles/google-drive-standard.install.json")
    }

    return INSTALLATION_PROFILES
}

module.exports = LoadAllInstalationProfiles