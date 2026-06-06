# Troubleshooting — Setup Wizard

| Sintoma | Causa provável / solução |
|---------|--------------------------|
| `mywizard install` falha sem `--profile` | O default interno `standard` **não** é um perfil registrado. Informe um perfil registrado: `release-minimal`, `release-standard` ou `localfs-release-standard`. Ver [known-issues](./known-issues.md). |
| Perfil não encontrado (ex.: `dev-localfs-standard`) | Esse nome **não** está registrado (é só um arquivo modelo). Use um dos três registrados. Ver [installation-profiles](./installation-profiles.md). |
| `show-profile` não mostra nada / erro | Comando **quebrado** na versão atual (aponta para arquivos inexistentes). Use `list-profiles` e inspecione o `*.install.json`. Ver [known-issues](./known-issues.md). |
| Repositório não instala (fonte) | A entrada da fonte (`LOCAL_FS`/`GITHUB_RELEASE`/`GOOGLE_DRIVE`) precisa existir em [`configs/repository-sources.json`](../configs/repository-sources.json) para o `namespace` e `sourceType` usados. Ver [config-files](./config-files.md). |
| `LOCAL_FS`: caminho inexistente | Ajuste o `path` da fonte em `repository-sources.json` para o repositório no disco. Ver [localfs-installation](./localfs-installation.md). |
| `GITHUB_RELEASE`: download falha | Confirme `repositoryOwner`/`repositoryName` e a existência de uma release publicada. Ver [github-release-installation](./github-release-installation.md). |
| Comandos do ecossistema não encontrados após instalar | Adicione `EcosystemData/executables` ao `PATH`. |
| `mywizard` não existe (a partir do código) | Rode `npm install && npm link` no repositório do wizard. |

Lista de inconsistências conhecidas: [known-issues.md](./known-issues.md).
