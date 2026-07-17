# Known Issues — Setup Wizard

Inconsistências **confirmadas no código** (`v0.0.19`) entre a documentação
histórica e o comportamento real. Enquanto não corrigidas no código, a
documentação pública (README) descreve apenas o comportamento que funciona.

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

---

> Ao corrigir qualquer um destes no código, atualize o README e remova o item
> correspondente daqui.
