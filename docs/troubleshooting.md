# Troubleshooting — Setup Wizard

| Sintoma | Causa provável / solução |
|---------|--------------------------|
| `mywizard install` falha sem `--profile` | `--profile` é **obrigatório** (`demandOption`): o yargs recusa com `Missing required argument: profile`. Informe um perfil registrado (veja `list-profiles`). |
| Perfil não encontrado (ex.: `dev-localfs-standard`) | Esse nome **não** está registrado (é só um arquivo modelo). Use um dos registrados. Ver [installation-profiles](./installation-profiles.md). |
| `show-profile` não mostra nada / erro | Comando **quebrado** na versão atual (aponta para arquivos inexistentes). Use `list-profiles` e inspecione o `*.install.json`. Ver [known-issues](./known-issues.md). |
| `install` aborta com `fetch failed` / `UND_ERR_CONNECT_TIMEOUT` | Intermitência do GitHub (`codeload.github.com`/`github.com`). A partir da `v0.0.21` os downloads reexecutam 6× com backoff exponencial; se ainda assim falhar após as tentativas, o GitHub está indisponível — repita mais tarde. Ver [known-issues](./known-issues.md). |
| `install` "concluiu" mas `repos/`/`executables/` estão vazios | O install retorna exit code 0 mesmo ao falhar. Cheque o log por `A instalação cancelada!`. Ver [known-issues](./known-issues.md) item 4. |
| Repositório não instala (fonte) | A entrada da fonte (`LOCAL_FS`/`GITHUB_RELEASE`/`GOOGLE_DRIVE`) precisa existir em [`configs/repository-sources.json`](../configs/repository-sources.json) para o `namespace` e `sourceType` usados. Ver [config-files](./config-files.md). |
| `LOCAL_FS`: caminho inexistente | Os caminhos das fontes `LOCAL_FS` ficam embutidos no binário; os repositórios precisam existir exatamente neles. Ver [known-issues](./known-issues.md) item 5 e [localfs-installation](./localfs-installation.md). |
| `GITHUB_RELEASE`: download falha | Confirme `repositoryOwner`/`repositoryName` e a existência de uma release publicada. Ver [github-release-installation](./github-release-installation.md). |
| Comandos do ecossistema não encontrados após instalar | Adicione `EcosystemData/executables` ao `PATH`. |
| `mywizard` não existe (a partir do código) | Rode `npm install && npm link` no repositório do wizard. |
| Executáveis `*-dbg` não rodam sem `npm link` | O modo debug depende do código-fonte + Node (o binário `pkg` é compilado sem inspector). Use o repositório clonado com `npm link` para depurar. |

Lista de inconsistências conhecidas: [known-issues.md](./known-issues.md).
