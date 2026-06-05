# Installation Profiles — Setup Wizard

Um **Installation Profile** (`*.install.json`) descreve **o que** instalar
(repositórios e executáveis) e **onde**. O formato canônico está no
[Ecosystem Installation Profile Standard](https://github.com/Meta-Platform/meta-platform-open-standard/blob/main/specifications/ecosystem-installation-profile-standard.md).

## Perfis registrados (selecionáveis por nome)

Confirmado em
[`src/Helpers/LoadAllInstalationProfiles.js`](../src/Helpers/LoadAllInstalationProfiles.js):

| Nome (`--profile`) | Arquivo | Origem | Repositórios |
|--------------------|---------|--------|--------------|
| `release-minimal` | `github-release-minimal.install.json` | GitHub Release | `EssentialRepo` |
| `release-standard` | `github-release-standard.install.json` | GitHub Release | `EssentialRepo`, `EcosystemCoreRepo` |
| `localfs-release-standard` | `localfs-release-standard.install.json` | Sistema de arquivos local | `EssentialRepo`, `EcosystemCoreRepo` |

```bash
mywizard list-profiles    # lista exatamente esses três nomes
```

> Outros arquivos `*.install.json` existem no diretório como **modelo**, mas não
> são selecionáveis por nome (ver [known-issues.md](./known-issues.md)).

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
