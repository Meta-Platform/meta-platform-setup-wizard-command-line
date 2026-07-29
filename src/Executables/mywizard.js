#!/usr/bin/env node
const process = require("process")
const yargs = require("yargs/yargs")
const { hideBin } = require("yargs/helpers")

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
 * O erro em si já foi relatado por quem o capturou (ver Helpers/ReportFailure);
 * aqui a única responsabilidade é não mentir sobre o resultado.
 */
const RunCommand = (Command) => (args) =>
	Promise.resolve()
		.then(() => Command(args))
		.catch(() => { process.exitCode = 1 })

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
	.command('show-profile [profile]', 'Mostra informações sobre um perfil especifico', {
		profile: {
			describe: 'Perfil de instalação',
			default: 'standard',
			type: 'string',
			demandOption: true
		}
	}, ({ profile, installationPath }) => ShowProfileInfoCommand({ profile, installationPath }))
