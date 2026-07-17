# Installation Profiles — Setup Wizard

Um **Installation Profile** (`*.install.json`) descreve **o que** instalar
(repositórios e executáveis) e **onde**. O formato canônico está no
[Ecosystem Installation Profile Standard](https://github.com/Meta-Platform/meta-platform-open-standard/blob/main/specifications/ecosystem-installation-profile-standard.md).

## Perfis registrados (selecionáveis por nome)

Confirmado em
[`src/Helpers/LoadAllInstalationProfiles.js`](../src/Helpers/LoadAllInstalationProfiles.js):

Todo arquivo `*.install.json` do diretório é selecionável pelo seu nome (sem o
sufixo `.install.json`):

| Nome (`--profile`) | Arquivo | Origem | Repositórios |
|--------------------|---------|--------|--------------|
| `github-release-minimal` | `github-release-minimal.install.json` | GitHub Release | `EssentialRepo` |
| `github-release-standard` | `github-release-standard.install.json` | GitHub Release | `EssentialRepo`, `EcosystemCoreRepo` |
| `localfs-release-standard` | `localfs-release-standard.install.json` | Sistema de arquivos local | `EssentialRepo`, `EcosystemCoreRepo` |
| `dev-github-release-minimal` | `dev-github-release-minimal.install.json` | GitHub Release | `EssentialRepo` |
| `dev-github-release-standard` | `dev-github-release-standard.install.json` | GitHub Release | `EssentialRepo`, `EcosystemCoreRepo` |
| `dev-localfs-minimal` | `dev-localfs-minimal.install.json` | Sistema de arquivos local | `EssentialRepo` |
| `dev-localfs-standard` | `dev-localfs-standard.install.json` | Sistema de arquivos local | `EssentialRepo`, `EcosystemCoreRepo` |
| `dev-localfs-full` | `dev-localfs-full.install.json` | Sistema de arquivos local | `EssentialRepo`, `EcosystemCoreRepo`, `PlatformApplicationsRepo` |

```bash
mywizard list-profiles
```

> `release-minimal` e `release-standard` continuam aceitos como apelidos de
> `github-release-minimal` e `github-release-standard` — eram os nomes
> publicados até a `v0.0.19`.

> Ao adicionar um novo `*.install.json`, registre-o em
> [`src/Helpers/LoadAllInstalationProfiles.js`](../src/Helpers/LoadAllInstalationProfiles.js).
> O registro é estático (`require`) de propósito: o build `pkg` só embute
> arquivos referenciados estaticamente.

## Estrutura de um arquivo `.install.json`

```json
{
    "installationDataDir": "~/EcosystemData",
    "repositoriesToInstall": [
        {
            "namespace": "EssentialRepo",
            "sourceType": "LOCAL_FS",
            "executablesToInstall": ["supervisor", "mytoolkit", "repo"]
        }
    ]
}
```

| Campo | Descrição |
|-------|-----------|
| `installationDataDir` | Diretório `EcosystemData` de destino (aceita `~`). Pode ser sobrescrito por `--installation-path`. |
| `repositoriesToInstall[].namespace` | Nome do repositório; deve existir em [`configs/repository-sources.json`](../configs/repository-sources.json). |
| `repositoriesToInstall[].sourceType` | `LOCAL_FS`, `GITHUB_RELEASE` ou `GOOGLE_DRIVE`. |
| `repositoriesToInstall[].executablesToInstall` | Executáveis (de `applications.json` do repositório) a instalar em `EcosystemData/executables/`. |

## Convenção de nomes dos arquivos

`[dev-]<origem>-<escopo>`:

- **Destino:** `dev-*` → `~/Workspaces/.../EcosystemData`; demais → `~/EcosystemData`.
- **Origem:** `*localfs*` → `LOCAL_FS`; `*github-release*` → `GITHUB_RELEASE`.
- **Escopo:** `minimal` = só `EssentialRepo`; `standard` = `+ EcosystemCoreRepo`;
  `full` = `+ PlatformApplicationsRepo`.

Ver também: [localfs-installation.md](./localfs-installation.md) ·
[github-release-installation.md](./github-release-installation.md).
