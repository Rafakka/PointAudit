import { extrairDadosPonto } from './parser/commonPdfParser';
import 'dotenv/config'

const caminho = process.env.CAMINHO_PDF || ""

extrairDadosPonto(caminho)
.then(dados=>{console.log("===Auditoria de ponto finalizada===");})
.catch(err=>console.error("Falha no teste:",err))