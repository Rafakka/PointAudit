import { useState } from "react"
import { uploadPdf } from "../api/upload"
import { confirmJob, updateJob } from "../api/jobs"
import { finalizeJob } from "../api/jobs"
import { clearInput } from "../api/delete"
import { getExtractedData } from "../api/jobs"
import EmptyState from "./mainPanel/emptyState"
import { useRef } from "react"
import { Upload, Eye, CheckCircle, Rocket, Trash2} from "lucide-react"
import type { Phase, JobDocument, BalancedResult} from "@contracts"
import BalancePanel from "../components/BalancePanel.tsx"
import DayCard from "../components/DayCard.tsx"
import {ExportPanel} from "../components/ExportPanel.tsx"
import {exportJob} from "../api/export.ts"

type MainAreaProps = {
  phase: Phase | null
  loading: boolean
  error: string | null
  extractedData: JobDocument | null
  setExtractedData: React.Dispatch<React.SetStateAction<JobDocument | null>>
  editMode: boolean
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>
  balance:BalancedResult | null
  onExportJson: () => void
  onExportPdf: () => void
  onExportXlsx: () => void
  
}

export default function DashBoard(){

    const [jobId, setJobId] = useState<string | null>(null)
    const [phase, setPhase] = useState<Phase | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [extractedData, setExtractedData] = useState<JobDocument | null>(null)
    const [editMode, setEditMode] = useState(false)
    const fileInputRef = useRef<HTMLInputElement|null>(null)
    const [balance, setBalance] = useState<BalancedResult | null>(null)  
    const [savedPath,setSavedPath] = useState<string | null>(null)
    const [outputPath, setOutputPath] = useState<string | null>(null)
    const [outputType, setOutputType] = useState<outputType | null>(null)

    async function handleUpload(file:File):Promise<void>{
        try{
            
            console.log("UPLOAD INICIADO")

            setLoading(true)
            setError(null)

            const result = await uploadPdf(file)

            console.log(
                JSON.stringify(result, null, 2)
            )

            setJobId(result.jobId)
            setPhase(result.phase)
            
            console.log("JOBID:", result.jobId)
            console.log("PHASE:", result.phase)


        }catch(err:any){
            setError(err.message)
        }finally{
        if(fileInputRef.current) {fileInputRef.current.value=""}
            setLoading(false)
        }
    }

    async function handleViewer(){
        
        console.log("viewer iniciado")

        if(!jobId) return

        try{
            setLoading(true)
            setError(null)
            const result = await getExtractedData(jobId)
            console.log(result)
            setExtractedData(result)
            console.log(result)
            setPhase(result.phase)
            console.log(result.phase)            
            setEditMode(true)

        }catch(err:any){
            setError(err.message)
        }finally{
            setLoading(false)
        }
    }

    async function handleConfirm(){
        console.log("HANDLE CONFIRM DISPARADO ")
        if(!jobId)return
        try {
            setLoading(true)
            await updateJob(jobId, extractedData)
            const result = await confirmJob(jobId)
            setPhase(result.phase)
            setBalance(result.balance)
            setEditMode(false)
            console.log(result.phase)            
          }catch(err:any){
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

    async function handleFinalize() {
        console.log("HANDLE FINALIZE DISPARADO")
        console.log(jobId)
        if(!jobId)return
        try{
        setLoading(true)
        const result = await finalizeJob(jobId)
        console.log(result)
        setPhase(result.phase)
        console.log(result.phase)
        setSavedPath(result.filePath)
        
        console.log("Json salvo em: ", result.filePath)

        setEditMode(false)

        
        } catch (err:any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }    
    }
    
    async function handleExportJson() {

        if (!jobId) return

        const result = await exportJob(jobId,"json")

        setOutputPath(result.outputPath)
        setOutputType("json")

    }

    async function handleExportPdf() {
        console.log("pdf")
    }

    async function handleExportXlsx(){
        console.log("png")
    }

    async function handleClear() {
      if(!jobId) return

      await clearInput(jobId)

      setJobId(null)
      setPhase(null)
      setExtractedData(null)
      setEditMode(false)

    }

    return (
        <div className="h-screen w-screen flex bg-gray-100">
            <SideBar
            fileInputRef={fileInputRef}
            phase ={phase}
            onUpload={handleUpload}
            onHandleViewer={handleViewer}
            onConfirm={handleConfirm}
            onFinalize={handleFinalize}
            onClear={handleClear}
            
            />
            <MainArea
            balance={balance}
            phase={phase}
            loading={loading}
            error={error}
            extractedData={extractedData}
            setExtractedData={setExtractedData}
            editMode={editMode}
            setEditMode={setEditMode}
            
            onExportJson={handleExportJson}
            onExportPdf = {handleExportPdf}
            onExportXlsx = {handleExportXlsx}

            outputPath={outputPath}
            outputType={outputType}

            />
        </div>
    )
}

function SideBar(props:{
    phase:Phase | null,
    onUpload: (file:File)=> void,
    onHandleViewer:()=> void,
    onConfirm:() => void,
    onFinalize:() => void,
    onClear:() => void,
    fileInputRef: React.RefObject<HTMLInputElement | null>
}){
    const canView = props.phase === "ingested"
    const canConfirm = props.phase === "extracted"
    const canFinalize = props.phase === "confirmed"
    const canClear = props.phase !== null
    const canUpload = props.phase === null
    const fileInputRef = useRef<HTMLInputElement>(null)

    return (
    <aside className="w-64 bg-white border-1 flex flex-col p-4 gap-3">
    <input
    ref={fileInputRef}
    type="file"
    accept="application/pdf"
    style={{ display: "none" }}
    onChange={(e) => {
      const file = e.target.files?.[0]
      if (file) {
        props.onUpload(file)
        e.target.value = ""
      }
    }}
    />
  <button onClick={() => fileInputRef.current?.click()}
    disabled={!canUpload}
   className={`flex items-center gap-2 px-3 py-2 rounded transition-colors duration-150
  ${canUpload ? "hover:bg-gray-100 text-gray-800"
            : "text-gray-400 cursor-not-allowed opacity-50 pointer-events-none"}
            `}
    >
    <Upload size={18} />
    Carregar PDF
  </button>
  <button onClick={props.onHandleViewer}
  disabled={!canView}
  className={`flex items-center gap-2 px-3 py-2 rounded transition-colors duration-150
  ${canView ? "hover:bg-gray-100 text-gray-800"
            : "text-gray-400 cursor-not-allowed opacity-50 pointer-events-none"}
            `}
    >
  <Eye size={18} />
    Visualizar dados
  </button>
  <button onClick={props.onConfirm}
    disabled={!canConfirm}
   className={`flex items-center gap-2 px-3 py-2 rounded transition-colors duration-150
  ${canConfirm? "hover:bg-gray-100 text-gray-800"
            : "text-gray-400 cursor-not-allowed opacity-50 pointer-events-none"}
            `}
    >
  <CheckCircle size={18} />
    Confirmar
  </button>
  <button onClick={props.onFinalize}
  disabled={!canFinalize}
   className={`flex items-center gap-2 px-3 py-2 rounded transition-colors duration-150
  ${canFinalize ? "hover:bg-gray-100 text-gray-800"
            : "text-gray-400 cursor-not-allowed opacity-50 pointer-events-none"}
            `}
    >
  <Rocket size={18} />
    Finalizar
  </button>
  <button onClick={props.onClear}
  disabled={!canClear}
    className={`flex items-center gap-2 px-3 py-2 rounded transition-colors duration-150
  ${canClear ? "hover:bg-gray-100 text-gray-800"
            : "text-gray-400 cursor-not-allowed opacity-50 pointer-events-none"}
            `}
    >
  <Trash2 size={18} />
    Excluir Arquivo
  </button>
    </aside>
)
}

function MainArea({
  phase,
  loading,
  extractedData,
  editMode,
  setEditMode,
  setExtractedData,
  error,
  balance,
  onExportJson,
  onExportPdf,
  onExportXlsx,
  outputPath,
  outputType
}: MainAreaProps) {

  const canEdit = phase === "extracted"
  
  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <span className="text-gray-500">Carregando...</span>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <span className="text-red-500">{error}</span>
      </main>
    )
  }

  if (!extractedData) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <EmptyState />
      </main>
    )
  }

if (phase === "finalized") {
  return (
    <main className="flex-1 flex items-center justify-center">

      <div className="w-full max-w-2xl">

        <ExportPanel
          onJson={onExportJson}
          onPdf={onExportPdf}
          onXlsx={onExportXlsx}
        />

        {outputPath && (
          <div className="mt-4 bg-green-50 border border-green-300 rounded-lg p-4">

            <h3 className="font-semibold">
              Exportação concluída
            </h3>

            <p>
              Formato: {outputType}
            </p>

            <code className="block mt-2 break-all">
              {outputPath}
            </code>

          </div>
        )}

          </div>

        </main>
        )
    }

  return (
    <main className="flex-1 flex flex-col">

      <header className="h-12 bg-white border-b flex items-center justify-between px-4">
        <img src="/logo.png" className="w-5 h-5 opacity-60" />

        {canEdit && (
          <button
            onClick={() => setEditMode(prev => !prev)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            {editMode ? "Cancelar edição" : "Editar ponto"}
          </button>
        )}
      </header>

    <section className="flex-1 p-6">
  
    <div className="bg-white rounded shadow p-4 overflow-auto">

        <div className="bg-white rounded shadow p-4 overflow-auto">
          <h2 className="font-semibold mb-4 text-gray-700">
            Registros de Ponto
          </h2>

          <div className="space-y-4 text-sm">
            {Object.entries(extractedData?.timesheet?.dias ?? {}).map(
              ([key, day]) => (
               <DayCard
                key={key}
                day={day}
                dayKey={key}
                editMode={editMode}
                setExtractedData={setExtractedData}
                /> 
            )
        )}
            </div>
        </div>

            
    {phase!=="confirmed" && balance && (
        <BalancePanel balance={balance}/>
    )}
     </div>
      </section>
    </main>
  )
}
