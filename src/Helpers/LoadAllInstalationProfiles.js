const GITHUB_RELEASE_MINIMAL  = require("../../installation-profiles/github-release-minimal.install.json")
const GITHUB_RELEASE_STANDARD = require("../../installation-profiles/github-release-standard.install.json")

const LoadAllInstalationProfiles = () => {

    const INSTALLATION_PROFILES = {
        "github-release-minimal"      : GITHUB_RELEASE_MINIMAL,
        "github-release-standard"     : GITHUB_RELEASE_STANDARD,
        "localfs-release-standard"    : require("../../installation-profiles/localfs-release-standard.install.json"),

        "dev-github-release-minimal"  : require("../../installation-profiles/dev-github-release-minimal.install.json"),
        "dev-github-release-standard" : require("../../installation-profiles/dev-github-release-standard.install.json"),
        "dev-localfs-minimal"         : require("../../installation-profiles/dev-localfs-minimal.install.json"),
        "dev-localfs-standard"        : require("../../installation-profiles/dev-localfs-standard.install.json"),
        "dev-localfs-full"            : require("../../installation-profiles/dev-localfs-full.install.json"),

        // Nomes publicados até a v0.0.19; mantidos para não quebrar quem já os usa.
        "release-minimal"             : GITHUB_RELEASE_MINIMAL,
        "release-standard"            : GITHUB_RELEASE_STANDARD
    }

    return INSTALLATION_PROFILES
}

module.exports = LoadAllInstalationProfiles
