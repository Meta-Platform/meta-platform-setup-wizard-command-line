#!/usr/bin/env node
const process = require("process")
const yargs = require("yargs/yargs")
const { hideBin } = require("yargs/helpers")

const ListProfilesCommand = require("../Commands/ListProfiles.command")
const InstallCommand = require("../Commands/Install.command")
const UpdateCommand = require("../Commands/Update.command")
const ShowProfileInfoCommand = require("../Commands/ShowProfileInfo.command")

const { argv } = yargs(hideBin(process.argv))
	.command('list-profiles', 'Exibe os perfis de instalação disponíveis', () => ListProfilesCommand())
	.command('install [profile] [installation-path]', 'Instala um ecosistema conforme o perfil especificado', {
		profile: {
			describe: 'Perfil de instalação',
			default: 'standard'
		},
		'installation-path': {
			describe: 'Caminho personalizado para os dados de instalação',
			type: 'string'
		}
	}, ({ profile, installationPath }) => InstallCommand({ profile, installationPath }))
	.command('update [profile] [installation-path]', 'Atualiza os repositórios, executáveis e binários de um ecosistema instalado', {
		profile: {
			describe: 'Perfil de instalação',
			default: 'standard',
			type: 'string'
		},
		'installation-path': {
			describe: 'Caminho personalizado para os dados de instalação',
			type: 'string'
		}
	}, ({ profile, installationPath }) => UpdateCommand({ profile, installationPath }))
	.command('show-profile [profile]', 'Mostra informações sobre um perfil especifico', {
		profile: {
			describe: 'Perfil de instalação',
			default: 'standard',
			type: 'string',
			demandOption: true
		}
	}, ({ profile, installationPath }) => ShowProfileInfoCommand({ profile, installationPath }))
