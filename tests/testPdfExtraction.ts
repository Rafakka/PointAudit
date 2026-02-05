import * as fs from 'fs'
import { PDFParse } from 'pdf-parse'
import { normalize } from '../src/parser/basic'
import { extractData } from '../src/parser/dataUserParser'
import { buildTimeSheet } from '../src/parser/timeSheetFormatter'

const caminho = "input/ponto janeiro eletronico.pdf"

async function debugPdf(path:string) {
    const buffer = fs.readFileSync(path)

    const parser = new PDFParse({data:buffer})
    const result = await parser.getText()

    console.log("===PDF METADATA===")
    console.log({
        pages:result.pages?.length,
        hasPages:Array.isArray(result.pages),
    });

    console.log("\n===RAW PAGE STRUCTURE(first page)===")
    console.log(result.pages?.[0])

    console.log("\n===RAW TEXT(first 500 chars)===")
    console.log(result.text.slice(0,500))

    console.log("\n===RAW TEXT FULL===")
    console.log(result.text)

    console.log("\n===AFTER NORMALIZATION TEXT FULL===")
    const normalizedText = normalize(result.text)
    console.log(normalizedText)

    console.log("\n===AFTER N+EXTRACTION TEXT FULL===")
    const normalizedAndExtractedText = extractData(normalizedText)
    console.log(normalizedAndExtractedText)

    console.log("\n===TIME SHEET===")
    const sheet = buildTimeSheet(normalizedText)
    console.log(sheet)

}

debugPdf(caminho)