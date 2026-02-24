import { useState } from "react"
import { uploadPdf } from "../api/upload"
import { confirmJob } from "../api/jobs"
import { finalizeJob } from "../api/jobs"
import { clearInput } from "../api/delete"
import { getExtractedData } from "../api/jobs"
import EmptyState from "./mainPanel/emptyState"
import { useRef } from "react"
import { Upload, Eye, CheckCircle, Rocket, Trash2 } from "lucide-react"
import type { Phase, ExtractedData, TimeSheetData, TimeEntry, PersonalData, PersonalMeta } from "../types/pipeline"

type MainAreaProps = {
  phase: Phase | null
  loading: boolean
  error: string | null
  extractedData: ExtractedData | null
  setExtractedData: React.Dispatch<React.SetStateAction<ExtractedData | null>>
  editMode: boolean
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DashBoard(){

    const [jobDir, setJobDir] = useState<string | null>(null)
    const [phase, setPhase] = useState<Phase | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
    const [editMode, setEditMode] = useState(false)

    async function handleUpload(file:File){
        console.log("UPLOADED TRIGGERED",file)
        try{
            setLoading(true)
            setError(null)

            const result = await uploadPdf(file)

            setJobDir(result.jobDir)
            setPhase(result.phase)

        }catch(err:any){
            setError(err.message)
        }finally{
            setLoading(false)
        }
    }

    async function handleViewer(){
        if(!jobDir) return

        try{
            setLoading(true)
            setError(null)

            const result = await getExtractedData(jobDir)

            setPhase(result.phase)
            setExtractedData({
                personal: result.personalData,
                timesheet: result.timeData
            })

        }catch(err:any){
            setError(err.message)
        }finally{
            setLoading(false)
        }
    }

    async function handleConfirm(){
        if(!jobDir)return
        try {
            setLoading(true)
            const result = await confirmJob(jobDir)
            setPhase(result.phase)}catch(err:any){
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

    async function handleFinalize() {
        if(!jobDir)return
        try{
        setLoading(true)
        const result = await finalizeJob(jobDir)
        setPhase(result.phase)
        } catch (err:any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
        
    }

    async function handleClear() {
        await clearInput()
        setJobDir(null)
        setPhase(null)
        setExtractedData(null)
        setEditMode(false)
    }

    return (
        <div className="h-screen w-screen flex bg-gray-100">
            <SideBar
            phase ={phase}
            onUpload={handleUpload}
            onHandleViewer={handleViewer}
            onConfirm={handleConfirm}
            onFinalize={handleFinalize}
            onClear={handleClear}
            
            />
            <MainArea
            phase={phase}
            loading={loading}
            error={error}
            extractedData={extractedData}
            setExtractedData={setExtractedData}
            editMode={editMode}
            setEditMode={setEditMode}
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
      if (file) props.onUpload(file)
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

function MainArea({phase, loading, error, extractedData, editMode, setEditMode, setExtractedData}:MainAreaProps){
    const canEdit = phase === "extracted"
    return (
        <main className="flex-1 flex flex-col">
            <header className="h-12 bg-white border-b flex items-center px-4">
                <img src="/logo.png" className="w-5 h-5 opacity-60"/>
                {canEdit && (
                <button
                    onClick={() => setEditMode(!editMode)}
                    className="mb-4 px-3 py-1 bg-gray-200 rounded"
                >
                    {editMode ? "Cancelar edição" : "Editar dados"}
                </button>
            )}
            </header>
            <section className="flex-1 flex items-center justify-center p-6">
                {!loading && extractedData && (
                <div className="w-full h-full p-6 grid grid-cols-2 gap-6">

                    {/* Personal Data */}
                    <div className="bg-white rounded shadow p-4 overflow-auto">
                    <h2 className="font-semibold mb-4 text-gray-700">
                        Dados do Funcionário
                    </h2>

                    <div className="flex items-center gap-2">
                    <strong>Nome:</strong>
                    {editMode ? (
                        <input
                        value={extractedData.personal.meta.nome || ""}
                        onChange={(e) =>
                            setExtractedData(prev => ({
                            ...prev!,
                            personal: {
                                ...prev!.personal,
                                meta: {
                                ...prev!.personal.meta,
                                nome: e.target.value
                                }
                            }
                            }))
                        }
                        className="border rounded px-2 py-1 text-sm"
                        />
                    ) : (
                        <span>{extractedData.personal.meta.nome}</span>
                    )}
                    </div>
                    </div>

                    {/* Timesheet */}
                    <div className="bg-white rounded shadow p-4 overflow-auto">
                    <h2 className="font-semibold mb-4 text-gray-700">
                        Registros de Ponto
                    </h2>

                    <div className="space-y-2 text-sm">
                        {extractedData.timesheet.dias.map((dia:any, index:number)=>(
                        <div key={index} className="border-b pb-2">
                            <div><strong>Data:</strong> {dia.data}</div>
                            <div><strong>Horas:</strong> {dia.horas}</div>
                        </div>
                        ))}
                    </div>
                    </div>

                </div>
                )}
                </section>
        </main>
    )
}