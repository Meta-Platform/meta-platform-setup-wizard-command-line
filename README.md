<p align="center">
  <img alt="Setup Wizard" width="200px" src="logo.svg">
</p>

<h1 align="center">Meta Platform Setup Wizard</h1>

> O **instalador** da Meta Platform: monta um ecossistema (`EcosystemData`) a
> partir de um installation profile, com o comando `mywizard`.

## Papel dentro da Meta Platform

A Meta Platform é um ecossistema modular (ver
[portal](https://github.com/Meta-Platform) e
[mapa de repositórios](https://github.com/Meta-Platform/.github/blob/main/docs/repository-map.md)).
O **Setup Wizard** é a porta de entrada: lê um
[Installation Profile](https://github.com/Meta-Platform/meta-platform-open-standard/blob/main/specifications/ecosystem-installation-profile-standard.md),
baixa/copia os repositórios escolhidos para o
[EcosystemData](https://github.com/Meta-Platform/.github/blob/main/docs/ecosystemdata.md)
e instala os executáveis. Internamente, usa o
[cli-script-loader](https://github.com/Meta-Platform/meta-platform-cli-script-loader-library)
para carregar libs do `EssentialRepo`.

## Quando usar

Quando você quer **instalar ou atualizar** um ecossistema Meta Platform na máquina.

## Instalação

### Opção A — release binária

```bash
wget https://github.com/Meta-Platform/meta-platform-setup-wizard-command-line/releases/download/0.0.19/meta-platform-setup-wizard-command-line-0.0.19-preview-linux-x64 -O mywizard
chmod +x mywizard
./mywizard --help
```

> **Nota:** o asset publicado na release 0.0.19 usa o sufixo `-preview-` (a URL
> acima funciona), mas o script `build` atual gera o nome com sufixo `-alpha-` —
> uma futura re-release pode mudar a URL (ver a ERRATA da doc central).

> O binário é **autocontido** (empacotado com [`@yao-pkg/pkg`](https://github.com/yao-pkg/pkg),
> target `node22-linux-x64` no script `build`): **não exige Node.js instalado**
> para ser executado.

### Opção B — a partir do código (desenvolvimento)

```bash
npm install
npm link        # disponibiliza o comando `mywizard` globalmente
```

> Requer **Node.js** instalado. O `package.json` não declara `engines`; o build
> oficial visa `node22-linux-x64`, então uma versão LTS atual (22+) atende.

## Uso rápido

```bash
mywizard list-profiles                       # lista os perfis registrados
mywizard install --profile release-standard  # instala um ecossistema
mywizard update  --profile release-standard  # atualiza
mywizard install --profile release-standard --installation-path ~/meu-projeto/EcosystemData
```

## Comandos (comportamento confirmado)

Confirmado em [`src/Executables/mywizard.js`](./src/Executables/mywizard.js):

| Comando | Descrição |
|---------|-----------|
| `mywizard list-profiles` | Lista os perfis de instalação registrados. |
| `mywizard install [profile] [installation-path]` | Instala um ecossistema conforme o perfil. |
| `mywizard update [profile] [installation-path]` | Atualiza um ecossistema instalado. |

- `profile` / `--profile` e `installation-path` / `--installation-path` aceitam
  forma posicional ou de flag.
- **Sempre informe `--profile`** com um perfil registrado (o default interno
  `standard` não é um perfil válido — ver [docs/known-issues.md](./docs/known-issues.md)).
- O comando `show-profile` existe no CLI, mas está **quebrado** na versão atual —
  ver [docs/known-issues.md](./docs/known-issues.md).

## Perfis registrados

| Nome (`--profile`) | Origem | Repositórios |
|--------------------|--------|--------------|
| `release-minimal` | GitHub Release | `EssentialRepo` |
| `release-standard` | GitHub Release | `EssentialRepo`, `EcosystemCoreRepo` |
| `localfs-release-standard` | Sistema de arquivos local | `EssentialRepo`, `EcosystemCoreRepo` |

Detalhes, formato do `.install.json` e convenção de nomes:
[docs/installation-profiles.md](./docs/installation-profiles.md).

## Conceitos importantes

- [Installation Profile](https://github.com/Meta-Platform/meta-platform-open-standard/blob/main/specifications/ecosystem-installation-profile-standard.md) — o `*.install.json`.
- [EcosystemData](https://github.com/Meta-Platform/.github/blob/main/docs/ecosystemdata.md) — o ecossistema instalado.
- [Glossário](https://github.com/Meta-Platform/.github/blob/main/docs/glossario.md).

## Estrutura do repositório

```
src/
├── Executables/   # mywizard.js, mywizard-dbg.js (CLI yargs)
├── Commands/      # Install / Update / ListProfiles / ShowProfileInfo
└── Helpers/       # Installer, Updater, LoadAllInstalationProfiles, BuildRepositoriesInstallData
installation-profiles/   # arquivos *.install.json
configs/                 # configurações internas (ver docs/config-files.md)
```

## Exemplos

- [Instalação via LOCAL_FS](./docs/localfs-installation.md) (desenvolvimento)
- [Instalação via GITHUB_RELEASE](./docs/github-release-installation.md) (uso/produção)

## Troubleshooting

| Sintoma | Solução |
|---------|---------|
| `mywizard install` falha sem `--profile` | Informe um perfil registrado (`release-minimal`, `release-standard`, `localfs-release-standard`). |
| `show-profile` não funciona | Bug conhecido; use `list-profiles` e inspecione o `*.install.json`. Ver [known-issues](./docs/known-issues.md). |
| Comandos do ecossistema não encontrados após instalar | Garanta `EcosystemData/executables` no `PATH`. |

Guia completo: [docs/troubleshooting.md](./docs/troubleshooting.md). Lista de
inconsistências conhecidas: [docs/known-issues.md](./docs/known-issues.md).

## Links relacionados

- [Guia de Início Rápido](https://github.com/Meta-Platform/.github/blob/main/docs/GUIA-INICIO-RAPIDO.md)
- [Open Standard](https://github.com/Meta-Platform/meta-platform-open-standard)
- [Mapa de Repositórios](https://github.com/Meta-Platform/.github/blob/main/docs/repository-map.md)

## Licença

BSD-3-Clause. Veja `LICENSE`.

## Contato

Kaio Cezar — kadisk.shark@gmail.com
