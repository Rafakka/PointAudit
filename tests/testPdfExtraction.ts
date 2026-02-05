import { loadPdfText } from './helpers/loadPdfText'
import { normalize } from '../src/parser/basic'
import { extractData } from '../src/parser/dataUserParser'
import { buildTimeSheet } from '../src/parser/timeSheetFormatter'

const caminho = "input/ponto janeiro eletronico.pdf"

describe ("PDF INTEGRATION - real eletronic timesheet",()=>{
    let rawText:string
    let normalizeText:string

    beforeAll(async()=>{
        rawText = await loadPdfText(caminho)
        normalizeText = normalize(rawText)
    })

    it("Loads PDF text",()=>{
        expect(rawText.length).toBeGreaterThan(1000)
    })

    it("normalize text correctly",()=>{
        expect(normalizeText).toContain("funcionario")
        expect(normalizeText).not.toMatch(/[áéíóú]/)
    })

    it("Extracts user data",()=>{
        const user = extractData(normalizeText)

        expect(user.nome).toBeTruthy()
        expect(user.identificador).toMatch(/\d+/)
        expect(user.cargo).toBeTruthy()
    })

    it("build a timesheet",()=> {
        const sheet = buildTimeSheet(normalizeText)
        expect(sheet.dias).toBeDefined()
        expect(Object.keys(sheet.dias).length).toBeGreaterThan(10)
        const firstDay = sheet.dias["2026-01-05"]
        expect(firstDay).toBeDefined()
        expect(firstDay?.previsto.length).toBeGreaterThan(0)
        expect(firstDay?.realizado.length).toBeGreaterThan(0)
    })
})