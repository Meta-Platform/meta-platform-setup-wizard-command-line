# Known Issues — Setup Wizard

Inconsistências e limitações **confirmadas no código** entre o comportamento
esperado e o real.

## 1. `--installation-file` não existe

Versões antigas do README citavam `update --installation-file`. O CLI atual define
apenas `[profile]` e `[installation-path]`. Use `--profile` / `--installation-path`.

## 2. Trecho corrompido no README (corrigido)

O README continha `##### Exemplos:npm install -g @openai/codex` (texto colado por
engano). Corrigido para `##### Exemplos:`.

## 3. `install`/`update` retornam código de saída 0 mesmo ao falhar

Quando a instalação é abortada (por exemplo, um download que esgota as
tentativas), o processo registra `[Installer] A instalação cancelada!` mas ainda
encerra com **exit code 0**. Isso mascara a falha para scripts e automações, que
enxergam sucesso.

**Workaround:** não confie no código de saída; verifique o log
(`A instalação cancelada!`) e a existência de `EcosystemData/repos/` e
`EcosystemData/executables/` populados.

## 4. Caminhos `LOCAL_FS` ficam fixos no binário

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

- **`show-profile` reescrito.** Mantinha a própria lista de perfis, com nomes que
  já não existiam, e caía com `MODULE_NOT_FOUND` antes de qualquer verificação.
  Passou a ler a mesma lista do `list-profiles` e os nomes de campo reais.
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
