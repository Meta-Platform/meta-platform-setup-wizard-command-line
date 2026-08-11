/*
    Prepara o catálogo de fontes ANTES de ele virar o `sources.json` do
    ecossistema instalado.

    O catálogo (`configs/repository-sources.json`) é o índice de TODAS as fontes
    conhecidas da plataforma, incluindo as de desenvolvimento — os checkouts
    locais usados por quem trabalha na própria plataforma. Ele era gravado
    inteiro na instalação, e isso produzia duas coisas erradas na máquina de
    quem só quer USAR o ecossistema:

    1. Fontes de repositórios que o perfil nem instala. Uma instalação
       `release-standard` (Essential + EcosystemCore) nascia com uma fonte
       `PlatformApplicationsRepo` registrada — apontando para um diretório que
       não existe ali. Registrar caminho inexistente não é neutro: `repo sources`
       passa a listar uma fonte quebrada, e quem tentar usá-la recebe um erro de
       caminho em vez de "esse repositório não foi instalado".

    2. O workspace de desenvolvimento embutido. `~/Workspaces/meta-platform-repo`
       é onde o mantenedor da plataforma guarda os checkouts; numa instalação de
       usuário esse diretório não existe. O caminho continua no catálogo (os
       perfis `dev-*` e `localfs-*` dependem dele), mas agora é um PLACEHOLDER
       resolvido em tempo de instalação, e quem trabalha noutro diretório aponta
       `META_PLATFORM_WORKSPACE` para o seu.
*/

const WORKSPACE_PLACEHOLDER = "{{WORKSPACE}}"

// Mantido como default para não quebrar quem já tem o workspace nesse caminho —
// é onde a distribuição de referência coloca os checkouts.
const DEFAULT_WORKSPACE = "~/Workspaces/meta-platform-repo"

const _ResolveWorkspace = () => process.env.META_PLATFORM_WORKSPACE || DEFAULT_WORKSPACE

const _ResolvePlaceholders = (sourceData, workspace) =>
    Object
        .entries(sourceData)
        .reduce((resolvido, [chave, valor]) => ({
            ...resolvido,
            [chave]: typeof valor === "string" ? valor.split(WORKSPACE_PLACEHOLDER).join(workspace) : valor
        }), {})

/*
    `repositoriesToInstall` vem do perfil. Só as fontes desses repositórios vão
    para a instalação — com TODAS as suas alternativas (GITHUB_RELEASE, LOCAL_FS,
    GOOGLE_DRIVE), porque trocar a fonte de um repositório instalado é uma
    operação legítima (`repo change-source`). O que sai é o repositório inteiro
    que não faz parte do perfil.
*/
const PrepareRepositorySources = ({ repositoriesToInstall, sources, workspace = _ResolveWorkspace() }) =>
    (repositoriesToInstall || [])
        .map(({ namespace }) => namespace)
        .filter((namespace, indice, lista) => lista.indexOf(namespace) === indice)
        .filter((namespace) => Array.isArray(sources[namespace]))
        .reduce((selecionadas, namespace) => ({
            ...selecionadas,
            [namespace]: sources[namespace].map((sourceData) => _ResolvePlaceholders(sourceData, workspace))
        }), {})

module.exports = PrepareRepositorySources
module.exports.WORKSPACE_PLACEHOLDER = WORKSPACE_PLACEHOLDER
module.exports.DEFAULT_WORKSPACE = DEFAULT_WORKSPACE
