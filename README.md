<p align="center">
  <img alt="Setup Wizard" width="200px" src="logo.svg">
</p>

<h1 align="center">Meta Platform Setup Wizard</h1>

O **Meta Platform Setup Wizard** é uma ferramenta usada para configuração e instalação de ecossistemas **Meta Platform**. Ele facilita a preparação e personalização da instalação, garantindo que todos os componentes essenciais do ecossistema estejam integrados e funcionando de maneira otimizada.

## Como usar a release do projeto

A versão binária mais recente do **Meta Platform Setup Wizard** pode ser encontrada no link abaixo:

[Meta Platform Setup Wizard CLI - versão 0.0.19](https://github.com/Meta-Platform/meta-platform-setup-wizard-command-line/releases/download/0.0.19/meta-platform-setup-wizard-command-line-0.0.19-preview-linux-x64)

Esse binário funciona com o comando `mywizard`. Veja abaixo como fazer o download e utilizar os comandos disponíveis:

### Como baixar e usar a release
1. Faça o download do binário:
   ```bash
   wget https://github.com/Meta-Platform/meta-platform-setup-wizard-command-line/releases/download/0.0.19/meta-platform-setup-wizard-command-line-0.0.19-preview-linux-x64 -O mywizard
   ```

2. Torne o binário executável:
   ```bash
   chmod +x mywizard
   ```

3. Execute o binário para verificar os comandos disponíveis:
   ```bash
   ./mywizard --help
   ```

4. Exemplo de uso:
   ```bash
   ./mywizard list-profiles
   ```

## Perfis de Instalação

Um **perfil** descreve *o que* instalar (quais repositórios e executáveis) e
*de onde* (sistema de arquivos local ou release do GitHub). Os perfis são
arquivos `*.install.json` em [`installation-profiles/`](./installation-profiles/).

### Perfis expostos pela ferramenta

Os comandos `install`/`update`/`list-profiles` resolvem o perfil pelo **nome
registrado** em
[`src/Helpers/LoadAllInstalationProfiles.js`](./src/Helpers/LoadAllInstalationProfiles.js).
Atualmente, apenas três nomes estão registrados:

| Nome do perfil | Arquivo | Origem | Repositórios instalados |
|----------------|---------|--------|-------------------------|
| `release-minimal` | `github-release-minimal.install.json` | GitHub Release | `EssentialRepo` |
| `release-standard` | `github-release-standard.install.json` | GitHub Release | `EssentialRepo`, `EcosystemCoreRepo` |
| `localfs-release-standard` | `localfs-release-standard.install.json` | Sistema de arquivos local | `EssentialRepo`, `EcosystemCoreRepo` |

```bash
mywizard list-profiles    # lista exatamente esses três nomes
```

### Arquivos de perfil disponíveis em `installation-profiles/`

Além dos três registrados acima, existem outros arquivos `*.install.json` no
diretório (úteis como modelo). O nome segue a convenção
`[dev-]<origem>-<escopo>`:

- **Uso/destino:** `dev-*` instala em `~/Workspaces/meta-platform-repo/EcosystemData`
  (desenvolvimento); os demais instalam em `~/EcosystemData`.
- **Origem (`sourceType`):** `*localfs*` usa `LOCAL_FS` (lê os repositórios do
  disco); `*github-release*` usa `GITHUB_RELEASE`.
- **Escopo:** `minimal` = só `EssentialRepo`; `standard` = `EssentialRepo` +
  `EcosystemCoreRepo`; `full` = + `PlatformApplicationsRepo`.

| Arquivo | Destino | Origem | Escopo |
|---------|---------|--------|--------|
| `dev-github-release-minimal.install.json` | `~/Workspaces/.../EcosystemData` | GITHUB_RELEASE | minimal |
| `dev-github-release-standard.install.json` | `~/Workspaces/.../EcosystemData` | GITHUB_RELEASE | standard |
| `dev-localfs-minimal.install.json` | `~/Workspaces/.../EcosystemData` | LOCAL_FS | minimal |
| `dev-localfs-standard.install.json` | `~/Workspaces/.../EcosystemData` | LOCAL_FS | standard |
| `dev-localfs-full.install.json` | `~/Workspaces/.../EcosystemData` | LOCAL_FS | full |
| `github-release-minimal.install.json` | `~/EcosystemData` | GITHUB_RELEASE | minimal |
| `github-release-standard.install.json` | `~/EcosystemData` | GITHUB_RELEASE | standard |
| `localfs-release-standard.install.json` | `~/EcosystemData` | LOCAL_FS | standard |

> **Inconsistências observadas no código (`v0.0.19`) — `> TODO: confirmar`:**
> - O valor padrão de `--profile` em `install`/`update` é `standard`, que **não**
>   está registrado em `LoadAllInstalationProfiles`; rodar `mywizard install`
>   sem `--profile` falha ao resolver o perfil.
> - Os arquivos `dev-*` e `github-release-*` existem no diretório, mas **não**
>   estão registrados em `LoadAllInstalationProfiles`, portanto não são
>   selecionáveis por nome em `install`/`update`.
> - O comando `show-profile` aponta para arquivos que não existem no diretório
>   (`dev-minimal`, `dev-standard`, `minimal`, `standard`) e lê campos com nomes
>   antigos (`repositoryNamespace`, `appsToInstall`), divergindo do formato real
>   descrito a seguir.

### Estrutura de um arquivo `.install.json`

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
| `installationDataDir` | Diretório `EcosystemData` onde o ecossistema será instalado (aceita `~`). Pode ser sobrescrito por `--installation-path`. |
| `repositoriesToInstall[]` | Lista de repositórios a instalar. |
| `repositoriesToInstall[].namespace` | Nome do repositório; deve existir em [`configs/repository-sources.json`](./configs/repository-sources.json). |
| `repositoriesToInstall[].sourceType` | Origem: `LOCAL_FS`, `GITHUB_RELEASE` ou `GOOGLE_DRIVE`. |
| `repositoriesToInstall[].executablesToInstall` | Executáveis (de `metadata/applications.json` do repositório) a instalar em `EcosystemData/executables/`. |

### A pasta `configs/`

Configurações internas usadas pela ferramenta (não confundir com os perfis):

| Arquivo | Conteúdo |
|---------|----------|
| [`repository-sources.json`](./configs/repository-sources.json) | Fontes de cada repositório por `namespace` (LOCAL_FS/GITHUB_RELEASE/GOOGLE_DRIVE). Cruzado com `repositoriesToInstall` por [`BuildRepositoriesInstallData.js`](./src/Helpers/BuildRepositoriesInstallData.js). |
| [`ecosystem-defaults.json`](./configs/ecosystem-defaults.json) | Parâmetros padrão gravados no ecossistema instalado (ver [Open Standard](../meta-platform-open-standard/specifications/metadados/ecosystem-defaults.json)). |
| [`npm-dependencies.json`](./configs/npm-dependencies.json) | Dependências NPM mínimas instaladas no ecossistema. |
| [`meta-platform-dependencies.json`](./configs/meta-platform-dependencies.json) | Libs do `EssentialRepo` carregadas via *script loader* (ex.: `ecosystem-install-utilities.lib`). |
| [`app-params-dev.json`](./configs/app-params-dev.json) / [`app-params-release.json`](./configs/app-params-release.json) | Parâmetros do repositório mínimo usado para inicializar o *script loader* (`MINIMUM_REPO_*`). O código atual importa o de **release**. |

## Comandos Disponíveis

Os seguintes comandos estão disponíveis no **Meta Platform Setup Wizard**:

- [ATUALIZAR OS PERFIS](#atualizar-os-perfis)
  - [Comandos Disponíveis](#comandos-disponíveis)
    - [list-profiles](#list-profiles)
    - [show-profile](#show-profile)
      - [Exemplo:](#exemplo)
    - [install](#install)
      - [Instalação com Perfil Específico](#instalação-com-perfil-específico)
        - [Exemplos:](#exemplos)
      - [Alterar o Caminho dos Dados de Instalação](#alterar-o-caminho-dos-dados-de-instalação)
        - [Exemplo:](#exemplo-1)
    - [update](#update)
        - [Exemplos:](#exemplos-1)
      - [Atualização a partir de um arquivo de instalação](#atualização-a-partir-de-um-arquivo-de-instalação)
        - [Exemplos:](#exemplos-2)
  - [Configuração do projeto](#configuração-do-projeto)

### list-profiles

Exibe as informações sobre os perfis de instalação disponíveis na ferramenta.

```bash
./mywizard list-profiles
```

### show-profile

Exibe informações detalhadas sobre um perfil específico, como componentes incluídos e configurações recomendadas.

```bash
./mywizard show-profile --profile "<nome_do_perfil>"
```

#### Exemplo:

```bash
./mywizard show-profile --profile dev-standard
```

### install

Instala o ecossistema na pasta de usuário padrão, utilizando o perfil de instalação **standard** por padrão.

```bash
./mywizard install
```

#### Instalação com Perfil Específico

Escolha o perfil de instalação desejado.

```bash
./mywizard install --profile "<nome_do_perfil>"
```

##### Exemplos:npm install -g @openai/codex

```bash
./mywizard install --profile dev-localfs-standard
./mywizard install --profile release-minimal
```

#### Alterar o Caminho dos Dados de Instalação

Personalize o caminho onde o ecossistema será instalado especificando o diretório de dados.

```bash
./mywizard install --installation-path "<caminho_para_dados>"
```

##### Exemplo:

```bash
./mywizard install --installation-path "~/xpto/EcosystemData"
```

### update
Atualiza os repositórios, executáveis e binários de um ecosistema instalado.
Escolha o perfil de instalação desejado para atualizar.

```bash
./mywizard update --profile "<nome_do_perfil>"
```

##### Exemplos:

```bash
./mywizard update --profile dev-localfs-minimal
./mywizard update --profile release-standard
./mywizard update --profile localfs-release-standard
```

> **Nota — `> TODO: confirmar`:** a opção `--installation-file` aparecia em
> versões antigas deste README, mas o código atual
> ([`src/Executables/mywizard.js`](./src/Executables/mywizard.js)) define apenas
> as opções `[profile]` e `[installation-path]` para `update`. Use
> `--profile`/`--installation-path` (ou as posições equivalentes
> `update <profile> <installation-path>`).
## Configuração do projeto

Para começar a usar o Daemon Management Command-line do Meta Platform no seu sistema, siga os passos abaixo:

1. Abra o terminal.
2. Execute os comandos a seguir para instalar a ferramenta e configurar os links simbólicos necessários:

```bash
npm install
npm link
```