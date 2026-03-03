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
import { unWrapExtracted } from "../adapters/extractedAdapter"

type MainAreaProps = {
  phase: Phase | null
  loading: boolean
  error: string | null
  extractedData: JobDocument | null
  setExtractedData: React.Dispatch<React.SetStateAction<JobDocument | null>>
  editMode: boolean
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>
  balance:BalancedResult | null
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

    async function handleUpload(file:File):Promise<void>{
        try{
            setLoading(true)
            setError(null)

            const result = await uploadPdf(file)
            setJobId(result.jobId)
            setPhase(result.phase)

        }catch(err:any){
            setError(err.message)
        }finally{
        if(fileInputRef.current) {fileInputRef.current.value=""}
            setLoading(false)
        }
    }

    async function handleViewer(){
        if(!jobId) return

        try{
            setLoading(true)
            setError(null)
            const result = await getExtractedData(jobId)
            const unwrapped = unWrapExtracted(result)
            setExtractedData(unwrapped)
            console.log(unwrapped)
            console.log("going phase")
            setPhase(result.phase)
            setEditMode(true)

        }catch(err:any){
            setError(err.message)
        }finally{
            setLoading(false)
        }
    }

    async function handleConfirm(){
        if(!jobId)return
        try {
            setLoading(true)
            await updateJob(jobId, extractedData)
            const result = await confirmJob(jobId)
            setPhase(result.phase)
            setBalance(result.balance)
            setEditMode(false)
          }catch(err:any){
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

    async function handleFinalize() {
        if(!jobId)return
        try{
        setLoading(true)
        const result = await finalizeJob(jobId)
        setPhase(result.phase)
        setEditMode(false)
        } catch (err:any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
        
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
  balance
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
          <h2 className="font-semibold mb-4 text-gray-700">
            Registros de Ponto
          </h2>

          <div className="space-y-4 text-sm">
            {Object.entries(extractedData?.timesheet?.dias ?? {}).map(
              ([key, day]) => (
                <div key={key} className="border-b pb-4">

  <div><strong>Data:</strong> {day.date}</div>
  <div><strong>Semana:</strong> {day.weekday}</div>

  {/* Observação */}
  <div className="mt-2">
    <strong>Observação:</strong>

    {editMode ? (
      <input
        value={day.observacao}
        onChange={(e) => {
          const newValue = e.target.value

          setExtractedData(prev => {
            if (!prev) return prev

            return {
              ...prev,
              timesheet: {
                ...prev.timesheet,
                dias: {
                  ...prev.timesheet.dias,
                  [key]: {
                    ...prev.timesheet.dias[key],
                    observacao: newValue
                  }
                }
              }
            }
          })
        }}
        className="border rounded px-2 py-1 ml-2"
      />
    ) : (
      <span className="ml-2">{day.observacao}</span>
    )}
  </div>

  {/* Realizado */}
  <div className="mt-3">
    <strong>Realizado:</strong>

    <div className="flex flex-wrap gap-4 mt-2">
      {day.realizado.map((time, index) => (
        <div key={index} className="flex items-center gap-1">

          {editMode ? (
            <>
              <input
                type="number"
                value={time.h}
                onChange={(e) => {
                  const newHour = Number(e.target.value)

                  setExtractedData(prev => {
                    if (!prev) return prev

                    const updatedDay = {
                      ...prev.timesheet.dias[key],
                      realizado: prev.timesheet.dias[key].realizado.map((t, i) =>
                        i === index ? { ...t, h: newHour } : t
                      )
                    }

                    return {
                      ...prev,
                      timesheet: {
                        ...prev.timesheet,
                        dias: {
                          ...prev.timesheet.dias,
                          [key]: updatedDay
                        }
                      }
                    }
                  })
                }}
                            className="w-14 border rounded px-1"
                          />

                          <span>:</span>

                          <input
                            type="number"
                            value={time.m}
                            onChange={(e) => {
                              const newMin = Number(e.target.value)

                              setExtractedData(prev => {
                                if (!prev) return prev

                                const updatedDay = {
                                  ...prev.timesheet.dias[key],
                                  realizado: prev.timesheet.dias[key].realizado.map((t, i) =>
                                    i === index ? { ...t, m: newMin } : t
                                  )
                                }

                                return {
                                  ...prev,
                                  timesheet: {
                                    ...prev.timesheet,
                                    dias: {
                                      ...prev.timesheet.dias,
                                      [key]: updatedDay
                                    }
                                  }
                                }
                              })
                            }}
                            className="w-14 border rounded px-1"
                          />
                        </>
                      ) : (
                        <span>{time.h.toString().padStart(2, "0")}:{time.m.toString().padStart(2, "0")}</span>
                      )}

                    </div>
                  ))}
                </div>
              </div>

            </div>
              )
            )}
          </div>
      {phase!=="confirmed" && (
        <div className="balance-panel">
          <h3>Time Bank Summary</h3>
          <p>Total Worked:{balance.totalWorkingMinutes} min </p>
          <p>Total Required:{balance.totalRequiredMinutes} min </p>
          <p>Final Balance:
            <strong>
              {balance.formattedBalance}
            </strong>
          </p>
          <div/>
      )}
        </div>
      </section>
    </main>
  )
}