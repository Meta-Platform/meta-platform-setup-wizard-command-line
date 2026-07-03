# Instalação via LOCAL_FS — Setup Wizard

Instalação a partir de repositórios no **sistema de arquivos local** — o modo
típico de **desenvolvimento**, em que os repositórios são lidos diretamente do
disco.

## Quando usar

- Você tem os repositórios da plataforma clonados localmente e quer iterar sobre
  eles sem publicar releases.

## Pré-requisitos

- As entradas `LOCAL_FS` dos repositórios desejados devem existir em
  [`configs/repository-sources.json`](../configs/repository-sources.json), com o
  `path` correto para cada repositório no disco.

## Perfil registrado

O perfil registrado que usa `LOCAL_FS` é **`localfs-release-standard`**
(instala `EssentialRepo` + `EcosystemCoreRepo` a partir do disco, em
`~/EcosystemData`):

```bash
mywizard install --profile localfs-release-standard
# instalar em outro caminho
mywizard install --profile localfs-release-standard --installation-path ~/meu-projeto/EcosystemData
```

## O que acontece

1. O wizard lê o profile e, para cada `namespace`, busca a fonte `LOCAL_FS`
   correspondente em `repository-sources.json`.
2. Copia o repositório do `path` local para `EcosystemData/repos/`.
3. Registra o repositório em `repositories.json` e cria os scripts dos
   `executablesToInstall` em `EcosystemData/executables/`.

## Atualizar

```bash
mywizard update --profile localfs-release-standard
```

> Para registrar/instalar repositórios locais adicionais já com o ecossistema no
> ar, use a CLI `repo` (ex.: `repo register source MeuRepo LOCAL_FS --localPath ...`).
> Ver [github-release-installation.md](./github-release-installation.md) para o
> modo de release.
