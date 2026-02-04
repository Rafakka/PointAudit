import * as fs from 'fs'
import { PDFParse } from 'pdf-parse/dist/pdf-parse/esm/PDFParse'

interface DadosFuncionario {
    nome:string
    registro:string
    centroCusto:string
    atrasos:string
    cargo:string
}

function extractFullText(result:any):string {
    return result.pages
    .map((page:any)=>page.content    
    .map((item:any)=>item.str)
    .join("")
    )
    .join("\n");
}

function extractData(text:string):DadosFuncionario {
    return {
        nome:
        text.match(/Funcion[aá]rio:s*\(.*?)(?:\n|Registro)/)?.[1]?.trim()?? "Não encontrado",

        registro:
        text.match(/Registro:\s*(\d+)/)?.[1]?? "0",

        centroCusto:
        text.match(/Centro\s+Custo:\s*(.*?)(?:Departamento|\n)/)?.[1] ?? "Não encontrado",

        cargo:
        text.match(/Cargo:\s*(.*?)(?:Cart[ãa]o|\n)/)?.[1]?.trim()?.[1]?? "Não encontrado",

        atrasos:
        text.match(/Total\s+de\s+Ocorr[eê]ncias\s+.*?\s+(\d+:\d+)/)?.[1]?? "00:00",

    }
}

export async function extrairDadosPonto(caminhoPdf:string) {
    if (!fs.existsSync(caminhoPdf))
    {
        console.error("Arquivo não encontrado");
        return;
    }

    const buffer = fs.readFileSync(caminhoPdf)

    const parser = new PDFParse({data:buffer});
    const result = await parser.getInfo();

    const texto = extractFullText(result)
    const dados = extractData(texto)

    console.log (dados);
    return dados

    }