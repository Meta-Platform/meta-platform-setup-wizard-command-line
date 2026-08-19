#!/usr/bin/env node
const process = require("process")
const yargs = require("yargs/yargs")
const { hideBin } = require("yargs/helpers")

/*
 * `Log` é global e alguém precisa instalá-lo antes do primeiro comando. Quem
 * instalava era o SetupCLIScriptLoader, chamado só por `install` e `update` --
 * ver Helpers/EnsureLogger para o porquê e para a ordem de tentativas.
 */
const EnsureLogger = require("../Helpers/EnsureLogger")
const ReportFailure = require("../Helpers/ReportFailure")

EnsureLogger({ origin: "wizard" })

const ListProfilesCommand = require("../Commands/ListProfiles.command")
const InstallCommand = require("../Commands/Install.command")
const UpdateCommand = require("../Commands/Update.command")
const ShowProfileInfoCommand = require("../Commands/ShowProfileInfo.command")

/*
 * Falha de comando tem de virar CÓDIGO DE SAÍDA (VDRP-275).
 *
 * O handler do yargs recebia a Promise e ninguém a observava: uma instalação
 * interrompida terminava o processo com 0, e quem chamou seguia como se tivesse
 * dado certo. Dentro de um Dockerfile isso é caro — no build 186 da plataforma
 * VirtualDesk o `mywizard install` falhou, devolveu sucesso, o build avançou e só
 * quebrou dois passos depois com "repo: not found" (código 127), apontando para o
 * lugar errado.
 *
 * E RELATA, em vez de supor que outro já relatou.
 *
 * A premissa anterior era que o erro já teria sido impresso por quem o capturou.
 * Ela vale para o que acontece DENTRO do try do Installer — e só. Um erro
 * lançado antes dele (carregar uma lib do EssentialRepo, por exemplo) chega
 * aqui sem ter passado por relato nenhum, e este `catch` o descartava: o
 * processo saía 1, mudo. Foi o que aconteceu quando o EssentialRepo virou
 * TypeScript e o `require` da lib de instalação parou de resolver — o build de
 * imagem parava num `RUN ./mywizard install` sem uma linha de erro, e horas se
 * foram atrás de um sintoma que aparecia em outro passo.
 *
 * Relatar duas vezes é barato. Não relatar nenhuma custou o dia.
 */
const RunCommand = (Command) => (args) =>
	Promise.resolve()
		.then(() => Command(args))
		.catch((error) => {
			ReportFailure("mywizard", "O comando falhou.", error)
			process.exitCode = 1
		})

const { argv } = yargs(hideBin(process.argv))
	.command('list-profiles', 'Exibe os perfis de instalação disponíveis', () => ListProfilesCommand())
	.command('install [profile] [installation-path]', 'Instala um ecosistema conforme o perfil especificado', {
		profile: {
			describe: 'Perfil de instalação',
			type: 'string',
			demandOption: true
		},
		'installation-path': {
			describe: 'Caminho personalizado para os dados de instalação',
			type: 'string'
		}
	}, RunCommand(({ profile, installationPath }) => InstallCommand({ profile, installationPath })))
	.command('update [profile] [installation-path]', 'Atualiza os repositórios, executáveis e binários de um ecosistema instalado', {
		profile: {
			describe: 'Perfil de instalação',
			type: 'string',
			demandOption: true
		},
		'installation-path': {
			describe: 'Caminho personalizado para os dados de instalação',
			type: 'string'
		}
	}, RunCommand(({ profile, installationPath }) => UpdateCommand({ profile, installationPath })))
	/*
	 * O default era 'standard', que não é perfil registrado desde a renomeação
	 * para `github-release-*`: chamar sem argumento entregava "perfil não
	 * encontrado" em vez de ajudar. Com `demandOption` e sem default, o yargs
	 * cobra o argumento e o comando lista os disponíveis quando erra o nome.
	 */
	.command('show-profile [profile]', 'Mostra informações sobre um perfil especifico', {
		profile: {
			describe: 'Perfil de instalação',
			type: 'string',
			demandOption: true
		}
	}, ({ profile, installationPath }) => ShowProfileInfoCommand({ profile, installationPath }))
