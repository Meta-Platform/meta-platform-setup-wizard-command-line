/*
    `list-profiles` e `show-profile` são os comandos que existem para o usuário
    descobrir o que instalar. Os dois estavam quebrados ao mesmo tempo, e por
    motivos diferentes:

    - `list-profiles` chamava `Log.message` sem que ninguém tivesse instalado o
      logger global — quem instalava era o SetupCLIScriptLoader, no caminho de
      `install`/`update`. Morria com ReferenceError antes da primeira linha.
    - `show-profile` mantinha a própria lista de perfis, apontando para arquivos
      renomeados havia tempo. Morria com MODULE_NOT_FOUND.

    Nenhum dos dois tinha teste. Rodam aqui em processo separado, porque é o
    processo inteiro que precisa sobreviver — o logger é estado global.
*/

const test      = require("node:test")
const assert    = require("node:assert")
const path      = require("node:path")
const { execFileSync } = require("node:child_process")

const MYWIZARD = path.resolve(__dirname, "../src/Executables/mywizard.js")

const Rodar = (args) => {
    try {
        return { saida: execFileSync(process.execPath, [MYWIZARD, ...args], { encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] }), ok: true }
    } catch (erro) {
        return { saida: `${erro.stdout || ""}${erro.stderr || ""}`, ok: false }
    }
}

test("list-profiles roda sem logger instalado e lista os perfis", () => {
    const { saida, ok } = Rodar(["list-profiles"])

    assert.ok(ok, `list-profiles saiu com erro:\n${saida}`)
    assert.ok(!saida.includes("Log is not defined"), "o logger global não foi instalado no ponto de entrada")
    assert.ok(saida.includes("github-release-full"), "o perfil das aplicações não aparece na listagem")
    assert.ok(saida.includes("github-release-standard"), "a listagem perdeu perfis existentes")
})

test("show-profile descreve um perfil registrado", () => {
    const { saida, ok } = Rodar(["show-profile", "github-release-full"])

    assert.ok(ok, `show-profile saiu com erro:\n${saida}`)
    assert.ok(!saida.includes("MODULE_NOT_FOUND"), "show-profile ainda carrega arquivo de perfil inexistente")
    assert.ok(saida.includes("PlatformApplicationsRepo"), "não mostrou os repositórios do perfil")
    assert.ok(saida.includes("my-desktop"), "não mostrou os executáveis do perfil")
    assert.ok(!saida.includes("undefined"), "algum campo do perfil foi lido com o nome errado")
})

test("show-profile de perfil inexistente informa, em vez de quebrar", () => {
    const { saida } = Rodar(["show-profile", "perfil-que-nao-existe"])

    assert.ok(!saida.includes("MODULE_NOT_FOUND"), "perfil desconhecido derruba o comando")
    assert.ok(saida.includes("não encontrado"), "não informou que o perfil não existe")
    assert.ok(saida.includes("github-release-full"), "não ofereceu a lista de perfis válidos")
})
