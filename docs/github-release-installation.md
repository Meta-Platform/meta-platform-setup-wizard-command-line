# Instalação via GITHUB_RELEASE — Setup Wizard

Instalação a partir de **releases do GitHub** — o modo típico de **uso/produção**,
em que os repositórios são baixados das releases publicadas na organização
[Meta-Platform](https://github.com/Meta-Platform).

## Quando usar

- Você quer instalar a plataforma sem ter os repositórios clonados localmente.

## Pré-requisitos

- As entradas `GITHUB_RELEASE` dos repositórios devem existir em
  [`configs/repository-sources.json`](../configs/repository-sources.json)
  (`repositoryOwner` + `repositoryName`).

## Perfis registrados

Os perfis registrados que usam `GITHUB_RELEASE`:

| Perfil | Repositórios | Destino |
|--------|--------------|---------|
| `release-minimal` | `EssentialRepo` | `~/EcosystemData` |
| `release-standard` | `EssentialRepo` + `EcosystemCoreRepo` | `~/EcosystemData` |

```bash
mywizard install --profile release-minimal
mywizard install --profile release-standard
mywizard install --profile release-standard --installation-path ~/meu-projeto/EcosystemData
```

## O que acontece

1. O wizard lê o profile e, para cada `namespace`, busca a fonte
   `GITHUB_RELEASE` em `repository-sources.json`.
2. Baixa o asset da *latest release* do repositório (`repositoryOwner/repositoryName`).
3. Extrai para `EcosystemData/repos/`, registra em `repositories.json` e cria os
   scripts dos `executablesToInstall` em `EcosystemData/executables/`.

## Atualizar

```bash
mywizard update --profile release-standard
```

> Para desenvolvimento a partir do disco, ver
> [localfs-installation.md](./localfs-installation.md).
