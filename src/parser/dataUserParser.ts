
interface DadosFuncionario {
    nome:string
    centroCusto:string
    atrasos:string
    cargo:string
    registro:string
}

export function extractData(text:string):DadosFuncionario {

    const registroMatch = text.match(/registro\s*:\s*(\d+)/)
    const cartaoMatch = text.match(/cart[ãa]o\s*.\s*(\d+)/)

    //const lines = text.split('\n').map(l=>l.trim()).filter(Boolean)

    return {
        nome:
        text.match(/funcionario:\s*([a-z\s]+)/)?.[1]?.trim() ?? "Não encontrado",
        
        registro:
            registroMatch?.[1] ??
            cartaoMatch?.[1] ??
            "0",

        centroCusto:
        text.match(/centro\s*custo:\s*([a-z\s]+)/)?.[1]?.trim() ?? "Não encontrado",

        cargo:
        text.match(/cargo:\s*([a-z\s]+)/)?.[1]?.trim() ?? "Não encontrado",

        atrasos: "00:00"
    }
}
