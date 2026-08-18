/*
    O perfil promete um repositório numa fonte; o catálogo é quem tem de saber
    de onde baixá-la. Quando os dois divergem, nada falha na hora de registrar:
    a instalação vai até o ponto de obter o repositório e só ali descobre que a
    fonte prometida não existe.

    Foi assim que o `PlatformApplicationsRepo` ficou sem instalação por release
    — o repositório existia, os pacotes existiam, e faltava a fonte no catálogo.
*/

const test   = require("node:test")
const assert = require("node:assert")

const LoadAllInstalationProfiles = require("../src/Helpers/LoadAllInstalationProfiles")
const CATALOGO                   = require("../configs/repository-sources.json")

const PERFIS = LoadAllInstalationProfiles()

test("todo perfil registrado declara repositórios e destino de instalação", () => {
    Object.entries(PERFIS).forEach(([nome, perfil]) => {
        assert.ok(perfil.installationDataDir, `${nome}: sem installationDataDir`)
        assert.ok(Array.isArray(perfil.repositoriesToInstall), `${nome}: sem repositoriesToInstall`)
        assert.ok(perfil.repositoriesToInstall.length > 0, `${nome}: não instala repositório nenhum`)
    })
})

test("a fonte que o perfil pede existe no catálogo, para aquele repositório", () => {
    Object.entries(PERFIS).forEach(([nome, perfil]) => {
        perfil.repositoriesToInstall.forEach(({ namespace, sourceType }) => {
            const fontes = CATALOGO[namespace]
            assert.ok(fontes, `${nome}: repositório ${namespace} não está no catálogo de fontes`)

            const tipos = fontes.map((fonte) => fonte.sourceType)
            assert.ok(
                tipos.includes(sourceType),
                `${nome}: ${namespace} pede ${sourceType}, mas o catálogo só oferece ${tipos.join(", ")}`
            )
        })
    })
})

// Os perfis `dev-*` instalam dentro do workspace de propósito — é o que os
// distingue. A regra abaixo vale para os que um usuário comum executa.
test("perfil de release não depende de caminho no disco de ninguém", () => {
    Object
        .entries(PERFIS)
        .filter(([nome]) => !nome.startsWith("dev-"))
        .filter(([nome]) => nome.includes("github-release") || ["release-minimal", "release-standard", "release-full"].includes(nome))
        .forEach(([nome, perfil]) => {
            perfil.repositoriesToInstall.forEach(({ namespace, sourceType }) => {
                assert.strictEqual(
                    sourceType, "GITHUB_RELEASE",
                    `${nome}: ${namespace} usa ${sourceType} — um perfil de release tem de ser instalável em máquina limpa`
                )
            })
            assert.ok(
                !perfil.installationDataDir.includes("Workspaces"),
                `${nome}: instala dentro do workspace de desenvolvimento`
            )
        })
})

test("as aplicações têm release e entram no perfil completo", () => {
    const fontes = CATALOGO["PlatformApplicationsRepo"].map((fonte) => fonte.sourceType)
    assert.ok(fontes.includes("GITHUB_RELEASE"), "PlatformApplicationsRepo continua só em LOCAL_FS")

    const completo = PERFIS["github-release-full"]
    assert.ok(completo, "não há perfil de release que inclua as aplicações")

    const aplicacoes = completo.repositoriesToInstall.find(({ namespace }) => namespace === "PlatformApplicationsRepo")
    assert.ok(aplicacoes, "o perfil completo não instala PlatformApplicationsRepo")
    assert.ok(aplicacoes.executablesToInstall.includes("my-desktop"), "o perfil completo não instala a área de trabalho")
})

/*
    Executável pedido que não existe não faz o install falhar: o filtro de
    aplicações casa o que o perfil pede com o que o repositório publica, e o que
    não casa some sem aviso. Foi assim que seis perfis passaram a pedir
    `executor-panel` do EcosystemCoreRepo depois que o painel mudou para o
    repositório de aplicações — a instalação seguia "com sucesso", sem o painel.

    Este teste só roda no checkout da distribuição, onde os repositórios estão
    ao lado. Fora dele não há o que comparar, e ele se declara pulado.
*/

const fs   = require("node:fs")
const path = require("node:path")

const RAIZ_DISTRO = path.resolve(__dirname, "../../..")

const CAMINHOS_APPLICATIONS = {
    EssentialRepo:            "repos/essential-repository/metadata/applications.json",
    EcosystemCoreRepo:        "repos/ecosystem-core-repository/metadata/applications.json",
    PlatformApplicationsRepo: "repos/applications-repository/metadata/applications.json"
}

const _LerExecutaveisPublicados = () =>
    Object
        .entries(CAMINHOS_APPLICATIONS)
        .reduce((publicados, [namespace, relativo]) => {
            const caminho = path.join(RAIZ_DISTRO, relativo)
            if (!fs.existsSync(caminho)) return publicados

            const conteudo = JSON.parse(fs.readFileSync(caminho, "utf-8"))
            const aplicacoes = Array.isArray(conteudo) ? conteudo : (conteudo.applications || [])

            return { ...publicados, [namespace]: aplicacoes.map(({ executable }) => executable) }
        }, {})

test("todo executável pedido por um perfil é publicado pelo repositório", (t) => {
    const publicados = _LerExecutaveisPublicados()

    if (Object.keys(publicados).length === 0) {
        t.skip("repositórios não estão neste checkout")
        return
    }

    Object.entries(PERFIS).forEach(([nome, perfil]) => {
        perfil.repositoriesToInstall.forEach(({ namespace, executablesToInstall }) => {
            if (!publicados[namespace] || !executablesToInstall) return

            executablesToInstall.forEach((executavel) => {
                assert.ok(
                    publicados[namespace].includes(executavel),
                    `${nome}: pede "${executavel}" de ${namespace}, que não o publica — a instalação omitiria em silêncio`
                )
            })
        })
    })
})
