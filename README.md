<p align="center">
  <img alt="Setup Wizard" width="200px" src="logo.svg">
</p>

<h1 align="center">Meta Platform Setup Wizard</h1>

O **Meta Platform Setup Wizard** é uma ferramenta usada para configuração e instalação de ecossistemas **Meta Platform**. Ele facilita a preparação e personalização da instalação, garantindo que todos os componentes essenciais do ecossistema estejam integrados e funcionando de maneira otimizada.

## Como usar a release do projeto

A versão binária mais recente do **Meta Platform Setup Wizard** pode ser encontrada no link abaixo:

[Meta Platform Setup Wizard CLI - versão 0.0.16](https://github.com/Meta-Platform/meta-platform-setup-wizard-command-line/releases/download/0.0.16/meta-platform-setup-wizard-command-line-0.0.16-preview-linux-x64)

Esse binário funciona com o comando `mywizard`. Veja abaixo como fazer o download e utilizar os comandos disponíveis:

### Como baixar e usar a release
1. Faça o download do binário:
   ```bash
   wget https://github.com/Meta-Platform/meta-platform-setup-wizard-command-line/releases/download/0.0.16/meta-platform-setup-wizard-command-line-0.0.16-preview-linux-x64 -O mywizard
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
- **release-minimal** Configuração mínima, instala baixando do release hospedada no github
- **release-standard** Configuração padrão, instala baixando do release hospedada no github

# ATUALIZAR OS PERFIS
- **dev-localfs-minimal** Configuração mínima, instalada no local de execução do comando e não do diretório *home*, usando o sistema de arquivo local como fonte
- **dev-localfs-standard** Configuração padrão, instalada no local de execução do comando e não do diretório *home*, usando o sistema de arquivo locol como fonte
- **github-release-minimal** Configuração mínima, instala baixando do release hospedada no github
- **github-release-standard** Configuração padrão, instala baixando do release hospedada no github
- **github-repo-minimal** Configuração mínima, instala clonando do repositório do github
- **github-repo-standard** Configuração padrão, instala clonando do repositório do github
- **google-drive-minimal** Configuração mínima, instala baixando do gogle drive
- **google-drive-standard** Configuração padrão, instala baixando do gogle drive

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

##### Exemplos:

```bash
./mywizard install --profile dev-localfs-standard
./mywizard install --profile github-release-minimal
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
./mywizard update --profile github-release-standard
```

#### Atualização a partir de um arquivo de instalação

```bash
./mywizard update --installation-file "<caminho_do_arquivo_de_instalação>"
```

##### Exemplos:

```bash
./mywizard update --installation-file ~/xpto.install.json
```
## Configuração do projeto

Para começar a usar o Daemon Management Command-line do Meta Platform no seu sistema, siga os passos abaixo:

1. Abra o terminal.
2. Execute os comandos a seguir para instalar a ferramenta e configurar os links simbólicos necessários:

```bash
npm install
npm link
```