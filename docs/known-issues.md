# Known Issues — Setup Wizard

Inconsistências e limitações **confirmadas no código** entre o comportamento
esperado e o real. Atualizado para a `v0.0.21`.

## 1. `show-profile` está quebrado

[`src/Commands/ShowProfileInfo.command.js`](../src/Commands/ShowProfileInfo.command.js)
faz `require` de arquivos que **não existem** no diretório
`installation-profiles/` (`dev-minimal.install.json`, `dev-standard.install.json`,
`minimal.install.json`, `standard.install.json`) e lê campos com nomes **antigos**
(`repositoryNamespace`, `repositorySourceType`, `repositoryPath`, `appsToInstall`)
que divergem do formato real
([installation-profiles.md](./installation-profiles.md): `namespace`,
`sourceType`, `executablesToInstall`).

**Efeito:** `show-profile` não funciona para nenhum valor. **Workaround:** use
`list-profiles` e inspecione o arquivo `*.install.json` correspondente.

`show-profile` também mantém `default: 'standard'`, um perfil que não existe.

## 2. `--installation-file` não existe

Versões antigas do README citavam `update --installation-file`. O CLI atual define
apenas `[profile]` e `[installation-path]`. Use `--profile` / `--installation-path`.

## 3. Trecho corrompido no README (corrigido)

O README continha `##### Exemplos:npm install -g @openai/codex` (texto colado por
engano). Corrigido para `##### Exemplos:`.

## 4. `install`/`update` retornam código de saída 0 mesmo ao falhar

Quando a instalação é abortada (por exemplo, um download que esgota as
tentativas), o processo registra `[Installer] A instalação cancelada!` mas ainda
encerra com **exit code 0**. Isso mascara a falha para scripts e automações, que
enxergam sucesso.

**Workaround:** não confie no código de saída; verifique o log
(`A instalação cancelada!`) e a existência de `EcosystemData/repos/` e
`EcosystemData/executables/` populados.

## 5. Caminhos `LOCAL_FS` ficam fixos no binário

O [`configs/repository-sources.json`](../configs/repository-sources.json) é
embutido no binário no momento do build (`require` estático), então os `path` das
fontes `LOCAL_FS` (ex.: `~/Workspaces/meta-platform-repo/repos/...`) ficam
**congelados** na versão publicada. Para instalar via `LOCAL_FS`, os repositórios
precisam existir exatamente nesses caminhos.

**Workaround:** manter os clones nos caminhos esperados, ou registrar as fontes
com a CLI `repo` depois da instalação (ver
[localfs-installation.md](./localfs-installation.md)).

---

## Resolvidos

- **Downloads do install resilientes à intermitência do GitHub**
  (`v0.0.21` + `cli-script-loader 0.0.9` + essential `v0.0.33`). Os downloads do
  bootstrap (repositório mínimo) e do binário do package-executor usavam `fetch`
  sem retry; um `UND_ERR_CONNECT_TIMEOUT` intermitente do `codeload.github.com`
  abortava toda a instalação. Agora cada download é tentado 6 vezes com backoff
  exponencial (teto de 15 s).
- **`--profile` obrigatório com erro claro** (`v0.0.20`). Antes, o default interno
  `standard` (inexistente) gerava um `TypeError` confuso; hoje `install`/`update`
  usam `demandOption`.
- **Cópia `LOCAL_FS` de diretórios** (essential `v0.0.30`–`v0.0.33`). O
  `EISDIR` (subpastas e symlinks para diretório) e o `ELOOP` (symlink para um
  ancestral) ao copiar o repositório foram corrigidos em `copy-directory.lib`,
  preservando o filtro de `.git`/`node_modules`.

> Ao corrigir qualquer um dos itens abertos no código, atualize o README e mova o
> item correspondente para a seção **Resolvidos**.
