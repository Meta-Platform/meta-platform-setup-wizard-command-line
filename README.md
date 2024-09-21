# Meta Platform Setup Wizard

O **Meta Platform Setup Wizard** é uma ferramenta usada para configuração e instalação de ecossistemas **Meta Platform**. Ele facilita a preparação e personalização da instalação, garantindo que todos os componentes essenciais do ecossistema estejam integrados e funcionando de maneira otimizada.

## Como usar a release do projeto

A versão binária mais recente do **Meta Platform Setup Wizard** pode ser encontrada no link abaixo:

[Meta Platform Setup Wizard CLI - versão 0.0.6](https://github.com/Meta-Platform/meta-platform-setup-wizard-command-line/releases/download/0.0.6/meta-platform-setup-wizard-command-line-0.0.6-preview-linux-x64)

Esse binário funciona com o comando `mywizard`. Veja abaixo como fazer o download e utilizar os comandos disponíveis:

### Como baixar e usar a release
1. Faça o download do binário:
   ```bash
   wget https://github.com/Meta-Platform/meta-platform-setup-wizard-command-line/releases/download/0.0.6/meta-platform-setup-wizard-command-line-0.0.6-preview-linux-x64 -O mywizard
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

---

## Comandos Disponíveis
### Exibir Perfis de Instalação Disponíveis
Exibe as informações sobre os perfis de instalação disponíveis na ferramenta.

```bash
mywizard list-profiles
```

### Instalar um Ecossistema na Pasta Padrão do Usuário
Instala o ecossistema na pasta de usuário padrão, utilizando o perfil de instalação **standard** por padrão.

```bash
mywizard install
```

#### Exemplo:
```bash
mywizard install --profile standard
```

### Exibir Detalhes de um Perfil
Exibe informações detalhadas sobre um perfil específico, como componentes incluídos e configurações recomendadas.

```bash
mywizard show-profile --profile <nome_do_perfil>
```

#### Exemplo:
```bash
mywizard show-profile --profile dev-standard
```

### Instalar com Perfis Específicos
Escolha o perfil de instalação desejado para ajustar a configuração do ecossistema de acordo com suas necessidades.

- **dev-minimal**: Ambiente de desenvolvimento com o mínimo de recursos.
- **dev-standard**: Ambiente de desenvolvimento com recursos padrão.
- **minimal**: Ambiente de produção com recursos mínimos.
- **standard**: Ambiente de produção com recursos completos.

```bash
mywizard install --profile "<nome_do_perfil>"
```

#### Exemplos:
```bash
mywizard install --profile dev-minimal
mywizard install --profile dev-standard
mywizard install --profile minimal
mywizard install --profile standard
```

### Alterar o Caminho dos Dados de Instalação
Personalize o caminho onde o ecossistema será instalado especificando o diretório de dados.

```bash
mywizard install --installation-path "<caminho_para_dados>"
```

#### Exemplo:
```bash
mywizard install --installation-path "~/xpto/EcosystemData"
```

## Perfis de Instalação

Os perfis de instalação permitem que você escolha a configuração mais adequada para o seu ambiente. Abaixo está uma lista dos perfis disponíveis:

- **dev-minimal**: Configuração mínima para desenvolvimento, com os componentes essenciais.
- **dev-standard**: Configuração padrão para desenvolvimento, incluindo ferramentas adicionais.
- **minimal**: Configuração mínima para produção, com apenas os componentes essenciais.
- **standard**: Configuração completa para produção, com todos os componentes integrados.