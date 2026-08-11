const assert = require("node:assert/strict")
const test = require("node:test")
const path = require("path")

const PrepareRepositorySources = require("../src/Helpers/PrepareRepositorySources")
const { WORKSPACE_PLACEHOLDER, DEFAULT_WORKSPACE } = PrepareRepositorySources

const CATALOGO = require("../configs/repository-sources.json")

// Um perfil de usuário: instala Essential e EcosystemCore por release, e NÃO
// instala o repositório de aplicações.
const PERFIL_RELEASE = [
    { namespace: "EssentialRepo", sourceType: "GITHUB_RELEASE", executablesToInstall: ["repo"] },
    { namespace: "EcosystemCoreRepo", sourceType: "GITHUB_RELEASE", executablesToInstall: ["executor"] }
]

test("o ecossistema instalado não recebe fontes de repositórios que o perfil não instala", () => {
    const preparadas = PrepareRepositorySources({
        repositoriesToInstall: PERFIL_RELEASE,
        sources: CATALOGO,
        workspace: "/qualquer/workspace"
    })

    assert.deepEqual(Object.keys(preparadas).sort(), ["EcosystemCoreRepo", "EssentialRepo"])
    // Era o defeito: uma instalação release-standard nascia com esta fonte
    // registrada, apontando para um diretório que não existe na máquina.
    assert.equal(preparadas.PlatformApplicationsRepo, undefined)
})

test("as fontes alternativas do repositório instalado são preservadas", () => {
    const preparadas = PrepareRepositorySources({
        repositoriesToInstall: PERFIL_RELEASE,
        sources: CATALOGO,
        workspace: "/qualquer/workspace"
    })

    // Trocar a fonte de um repositório instalado é operação legítima
    // (`repo change-source`): o filtro é por REPOSITÓRIO, não por tipo de fonte.
    const tipos = preparadas.EssentialRepo.map(({ sourceType }) => sourceType)
    assert.ok(tipos.includes("GITHUB_RELEASE"))
    assert.ok(tipos.includes("LOCAL_FS"))
})

test("o caminho de workspace é resolvido, e nenhum placeholder vaza para a instalação", () => {
    const preparadas = PrepareRepositorySources({
        repositoriesToInstall: PERFIL_RELEASE,
        sources: CATALOGO,
        workspace: "/home/outra-pessoa/meu-workspace"
    })

    const local = preparadas.EssentialRepo.find(({ sourceType }) => sourceType === "LOCAL_FS")
    assert.equal(local.path, "/home/outra-pessoa/meu-workspace/repos/essential-repository")

    const serializado = JSON.stringify(preparadas)
    assert.ok(!serializado.includes(WORKSPACE_PLACEHOLDER), "placeholder não resolvido chegaria ao sources.json")
})

test("sem META_PLATFORM_WORKSPACE, vale o caminho da distribuição de referência", () => {
    const anterior = process.env.META_PLATFORM_WORKSPACE
    delete process.env.META_PLATFORM_WORKSPACE

    const preparadas = PrepareRepositorySources({ repositoriesToInstall: PERFIL_RELEASE, sources: CATALOGO })
    const local = preparadas.EssentialRepo.find(({ sourceType }) => sourceType === "LOCAL_FS")

    assert.equal(local.path, path.join(DEFAULT_WORKSPACE, "repos/essential-repository"))

    if (anterior !== undefined) process.env.META_PLATFORM_WORKSPACE = anterior
})

test("META_PLATFORM_WORKSPACE aponta o catálogo para outro checkout", () => {
    const anterior = process.env.META_PLATFORM_WORKSPACE
    process.env.META_PLATFORM_WORKSPACE = "/srv/plataforma"

    const preparadas = PrepareRepositorySources({ repositoriesToInstall: PERFIL_RELEASE, sources: CATALOGO })
    const local = preparadas.EssentialRepo.find(({ sourceType }) => sourceType === "LOCAL_FS")

    assert.equal(local.path, "/srv/plataforma/repos/essential-repository")

    if (anterior === undefined) delete process.env.META_PLATFORM_WORKSPACE
    else process.env.META_PLATFORM_WORKSPACE = anterior
})

test("perfil sem repositórios não produz fonte nenhuma, em vez de despejar o catálogo", () => {
    assert.deepEqual(PrepareRepositorySources({ repositoriesToInstall: [], sources: CATALOGO }), {})
    assert.deepEqual(PrepareRepositorySources({ repositoriesToInstall: undefined, sources: CATALOGO }), {})
})

test("repositório do perfil ausente do catálogo não vira entrada vazia", () => {
    const preparadas = PrepareRepositorySources({
        repositoriesToInstall: [{ namespace: "RepoInexistente", sourceType: "GITHUB_RELEASE" }],
        sources: CATALOGO
    })

    assert.deepEqual(preparadas, {})
})
