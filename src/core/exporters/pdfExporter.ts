
import PDFDocument from "pdfkit"
import fs from "fs"
import path from "path"
import { JobDocument } from "../../../contracts/job.ts"

export function writePdfOutput(
  job: JobDocument,
  outputDir: string
): string {

  const filePath = path.join(outputDir, "job.pdf")

  const doc = new PDFDocument()

  doc.pipe(fs.createWriteStream(filePath))

  doc.text("Point Audit")

  doc.end()

  return filePath
} 
