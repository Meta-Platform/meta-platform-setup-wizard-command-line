/*
    O EssentialRepo é TypeScript, e o `require` do Node não enxerga `.ts`.

    Quem carrega uma lib do ecossistema precisa antes armar a resolução — e
    ANTES de verdade: o `require` acontece fora de qualquer try, então uma
    resolução que falha não é relatada por ninguém e o processo termina mudo,
    com código 1 e nenhuma linha de erro. Foi assim que todo build de imagem da
    plataforma VirtualDesk passou a morrer num `RUN ./mywizard install`, com o
    arquivo presente no disco.

    Estes testes guardam a ORDEM, que é o que importa: armar antes de carregar.
*/

const test   = require("node:test")
const assert = require("node:assert")
const path   = require("node:path")

const Installer    = require("../src/Helpers/Installer")
const Updater      = require("../src/Helpers/Updater")
const DEPENDENCIAS = require("../configs/meta-platform-dependencies.json")

const CriarLoaderEspiao = () => {
    const carregados = []
    const LoaderScript = (uri) => {
        carregados.push(uri)
        // O que interessa é a ordem das chamadas; qualquer módulo real exigiria
        // um EssentialRepo instalado, que não existe num teste de unidade.
        if(uri.includes("module-resolution")) return {}
        throw new Error(`PAROU_EM:${uri}`)
    }
    return { LoaderScript, carregados }
}

test("a dependência que resolve TypeScript está declarada", () => {
    assert.ok(
        DEPENDENCIAS.some((uri) => uri.endsWith("/module-resolution.lib")),
        "meta-platform-dependencies.json precisa declarar module-resolution.lib"
    )
})

test("o instalador arma a resolução de TypeScript ANTES de carregar a lib de instalação", async () => {
    const { LoaderScript, carregados } = CriarLoaderEspiao()

    await assert.rejects(() => Installer({ profile: "release-standard", LoaderScript }))

    assert.strictEqual(carregados[0], "module-resolution.lib/src/register")
    assert.ok(
        carregados[1] && carregados[1].startsWith("ecosystem-install-utilities.lib/"),
        `a segunda carga deveria ser a lib de instalação, e foi ${carregados[1]}`
    )
})

test("o atualizador arma a resolução pela mesma razão", async () => {
    const { LoaderScript, carregados } = CriarLoaderEspiao()

    await assert.rejects(() => Updater({ profile: "release-standard", LoaderScript }))

    assert.strictEqual(carregados[0], "module-resolution.lib/src/register")
})

test("o relato de falha do executável não depende de outro ter relatado", () => {
    /*
        O `.catch` do mywizard descartava o erro por supor que quem o capturou
        já o havia impresso. Vale para o que acontece dentro do try do
        Installer, e só — o resto saía mudo.
    */
    const fonte = require("node:fs").readFileSync(
        path.join(__dirname, "..", "src", "Executables", "mywizard.js"), "utf8"
    )

    assert.match(fonte, /ReportFailure\(/, "o executável precisa relatar a falha que captura")
    assert.doesNotMatch(
        fonte, /\.catch\(\(\) => \{ process\.exitCode = 1 \}\)/,
        "o catch mudo voltou: erro fora do try do Installer some sem mensagem"
    )
})
