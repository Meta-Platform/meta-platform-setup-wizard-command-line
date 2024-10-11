<p align="center">
  <img alt="Setup Wizard" width="200px" src="logo.svg">
</p>

<h1 align="center">Meta Platform Setup Wizard</h1>

O **Meta Platform Setup Wizard** é uma ferramenta usada para configuração e instalação de ecossistemas **Meta Platform**. Ele facilita a preparação e personalização da instalação, garantindo que todos os componentes essenciais do ecossistema estejam integrados e funcionando de maneira otimizada.

## Como usar a release do projeto

A versão binária mais recente do **Meta Platform Setup Wizard** pode ser encontrada no link abaixo:

[Meta Platform Setup Wizard CLI - versão 0.0.10](https://github.com/Meta-Platform/meta-platform-setup-wizard-command-line/releases/download/0.0.10/meta-platform-setup-wizard-command-line-0.0.10-preview-linux-x64)

Esse binário funciona com o comando `mywizard`. Veja abaixo como fazer o download e utilizar os comandos disponíveis:

### Como baixar e usar a release
1. Faça o download do binário:
   ```bash
   wget https://github.com/Meta-Platform/meta-platform-setup-wizard-command-line/releases/download/0.0.10/meta-platform-setup-wizard-command-line-0.0.10-preview-linux-x64 -O mywizard
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

- **dev-minimal-localfs** Configuração mínima, instalada no local de execução do comando e não do diretório *home*, usando o sistema de arquivo local como fonte
- **dev-standard-localfs** Configuração padrão, instalada no local de execução do comando e não do diretório *home*, usando o sistema de arquivo locol como fonte
- **minimal-github-release** Configuração mínima, instala baixando do release hospedada no github
- **standard-github-release** Configuração padrão, instala baixando do release hospedada no github
- **minimal-github-repo** Configuração mínima, instala clonando do repositório do github
- **standard-github-repo** Configuração padrão, instala clonando do repositório do github
- **minimal-google-drive** Configuração mínima, instala baixando do gogle drive
- **standard-google-drive** Configuração padrão, instala baixando do gogle drive

## Comandos Disponíveis

Os seguintes comandos estão disponíveis no **Meta Platform Setup Wizard**:

- [Como usar a release do projeto](#como-usar-a-release-do-projeto)
  - [Como baixar e usar a release](#como-baixar-e-usar-a-release)
- [Perfis de Instalação](#perfis-de-instalação)
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

### list-profiles

Exibe as informações sobre os perfis de instalação disponíveis na ferramenta.

```bash
./mywizard list-profiles
```

### show-profile

Exibe informações detalhadas sobre um perfil específico, como componentes incluídos e configurações recomendadas.

```bash
./mywizard show-profile --profile <nome_do_perfil>
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
./mywizard install --profile dev-standard-localfs
./mywizard install --profile minimal-github-release
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
./mywizard update --profile dev-minimal-localfs
./mywizard update --profile standard-github-release
```