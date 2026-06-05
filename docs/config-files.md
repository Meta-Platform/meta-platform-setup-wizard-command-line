# Config Files — Setup Wizard

Configurações internas usadas pela ferramenta, no diretório
[`configs/`](../configs/). **Não confundir** com os
[installation profiles](./installation-profiles.md) (`*.install.json`).

| Arquivo | Conteúdo |
|---------|----------|
| [`repository-sources.json`](../configs/repository-sources.json) | Fontes de cada repositório, por `namespace`. Para cada repo, lista entradas `LOCAL_FS` (`path`), `GITHUB_RELEASE` (`repositoryName`, `repositoryOwner`) e/ou `GOOGLE_DRIVE` (`fileId`). Cruzado com `repositoriesToInstall` por [`src/Helpers/BuildRepositoriesInstallData.js`](../src/Helpers/BuildRepositoriesInstallData.js). |
| [`ecosystem-defaults.json`](../configs/ecosystem-defaults.json) | Parâmetros padrão gravados no ecossistema instalado (nomes de diretórios, extensões de Module/Layer/Group, etc.). Espelha o [`ecosystem-defaults.json` do Open Standard](https://github.com/Meta-Platform/meta-platform-open-standard/blob/main/specifications/metadados/ecosystem-defaults.json). |
| [`npm-dependencies.json`](../configs/npm-dependencies.json) | Dependências NPM mínimas instaladas no ecossistema (ex.: `@npmcli/arborist`, `webpack`, `@grpc/grpc-js`, `tar`, `yargs`, …). |
| [`meta-platform-dependencies.json`](../configs/meta-platform-dependencies.json) | Libs do `EssentialRepo` carregadas via [script loader](https://github.com/Meta-Platform/meta-platform-cli-script-loader-library) (ex.: `print-data-log.lib`, `ecosystem-install-utilities.lib`). |
| [`app-params-dev.json`](../configs/app-params-dev.json) | Parâmetros do **repositório mínimo** usado para inicializar o script loader em **desenvolvimento** (`MINIMUM_REPO_SOURCE_TYPE = LOCAL_FS`, `MINIMUM_REPO_PATH = ...`). |
| [`app-params-release.json`](../configs/app-params-release.json) | Idem para **release** (`MINIMUM_REPO_SOURCE_TYPE = GITHUB_RELEASE`, `MINIMUM_REPO_GITHUB_OWNER/NAME`). É o importado pelo código atual em `Install.command.js`/`Update.command.js`. |

## Fontes (`repository-sources.json`)

Estrutura confirmada (resumo):

```json
{
    "EssentialRepo": [
        { "sourceType": "LOCAL_FS",       "path": "~/Workspaces/meta-platform-repo/repos/essential-repository" },
        { "sourceType": "GITHUB_RELEASE", "repositoryName": "meta-platform-essential-repository", "repositoryOwner": "Meta-Platform" },
        { "sourceType": "GOOGLE_DRIVE",   "fileId": "..." }
    ],
    "EcosystemCoreRepo": [ /* ... */ ],
    "PlatformApplicationsRepo": [ /* ... */ ]
}
```

O `namespace` usado em um installation profile deve existir como chave neste
arquivo, e o `sourceType` escolhido no profile deve ter entrada correspondente
aqui.
