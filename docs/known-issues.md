# Known Issues — Setup Wizard

Inconsistências **confirmadas no código** (`v0.0.19`) entre a documentação
histórica e o comportamento real. Enquanto não corrigidas no código, a
documentação pública (README) descreve apenas o comportamento que funciona.

## 1. Default de `--profile` é `standard`, que não está registrado

`install`, `update` e `show-profile` usam `default: 'standard'`
([`src/Executables/mywizard.js`](../src/Executables/mywizard.js)), mas `standard`
**não** está entre os perfis registrados em
[`src/Helpers/LoadAllInstalationProfiles.js`](../src/Helpers/LoadAllInstalationProfiles.js)
(que registra apenas `release-minimal`, `release-standard`,
`localfs-release-standard`).

**Efeito:** rodar `mywizard install` **sem** `--profile` falha ao resolver o
perfil. **Workaround:** sempre informe um perfil registrado, ex.:
`mywizard install --profile release-standard`.

## 2. `show-profile` está quebrado

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

## 3. Arquivos `dev-*` e `github-release-*` não são selecionáveis por nome

Existem 8 arquivos em `installation-profiles/`, mas só 3 estão registrados em
`LoadAllInstalationProfiles`. Os demais (`dev-github-release-*`, `dev-localfs-*`,
`github-release-*`) servem como **modelo**, mas não podem ser passados em
`install`/`update` por nome.

## 4. `--installation-file` não existe

Versões antigas do README citavam `update --installation-file`. O CLI atual define
apenas `[profile]` e `[installation-path]`. Use `--profile` / `--installation-path`.

## 5. Trecho corrompido no README (corrigido)

O README continha `##### Exemplos:npm install -g @openai/codex` (texto colado por
engano). Corrigido para `##### Exemplos:`.

---

> Ao corrigir qualquer um destes no código, atualize o README e remova o item
> correspondente daqui.
