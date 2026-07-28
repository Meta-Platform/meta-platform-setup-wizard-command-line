const os   = require("os")
const path = require("path")

/*
 * Troca o logger mínimo instalado pelo `cli-script-loader` pela `logger.lib`
 * canônica, carregada do EssentialRepo que o LoaderScript já resolveu.
 *
 * Falhar não pode impedir a instalação nem a atualização do ecossistema: sem a
 * lib canônica, o logger mínimo continua valendo e a saída segue no terminal.
 */
const InstallLogger = ({
    LoaderScript,
    installationDataDir,
    ecosystemDefaults = {},
    origin = "wizard"
}) => {

    try {

        const InstallGlobalLogger = LoaderScript("logger.lib/src/InstallGlobalLogger")

        const {
            LOG_CONF_DIRNAME_LOGS,
            LOG_CONF_LEVEL,
            LOG_CONF_CONSOLE_LEVEL,
            LOG_CONF_MAX_FILE_SIZE_MB,
            LOG_CONF_RETENTION_DAYS
        } = ecosystemDefaults

        const dataDir = (installationDataDir || "").replace("~", os.homedir())

        return InstallGlobalLogger({
            origin,
            package       : "mywizard",
            logsDirPath   : dataDir
                ? path.join(dataDir, LOG_CONF_DIRNAME_LOGS || "logs", "ecosystem")
                : null,
            level         : LOG_CONF_LEVEL,
            /* A instalação é uma conversa com o usuário: o terminal mostra tudo. */
            consoleLevel  : "info",
            maxFileSizeMb : LOG_CONF_MAX_FILE_SIZE_MB,
            retentionDays : LOG_CONF_RETENTION_DAYS,
            force         : true
        })

    } catch (error) {
        return null
    }
}

module.exports = InstallLogger
