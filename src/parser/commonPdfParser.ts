import fs from 'fs'
import { PDFParse } from 'pdf-parse';
import { normalize } from './basic';

export async function extrairDadosPonto(caminhoPdf:string) {
    if (!fs.existsSync(caminhoPdf))
    {
        console.error("Arquivo não encontrado");
        return;
    }

    const buffer = fs.readFileSync(caminhoPdf)

    const parser = new PDFParse({data:buffer})
    const result = await parser.getText()

    const dados  = normalize(result.text)

    return dados

    }