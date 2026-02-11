import { useState } from "react"
import { uploadPdf } from "../api/upload"
import { confirmJob } from "../api/jobs"
import { finalizeJob } from "../api/jobs"
import { clearInput } from "../api/delete"
import { getExtractedData } from "../api/jobs"
import EmptyState from "./mainPanel/emptyState"
import { useRef } from "react"

type Phase =
| "ingested"
| "extracted"
| "confirmed"
| "finalized"

type MainAreaProps = {
    phase: Phase | null
    loading: boolean
    error: string | null
    extractedData: any | null
}

export default function DashBoard(){

    const [jobDir, setJobDir] = useState<string | null>(null)
    const [phase, setPhase] = useState<Phase | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [extractedData, setExtractedData] = useState<any | null>(null)

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
        try {
            setLoading(true)
            setError(null)

            const data = await getExtractedData(jobDir)
            setExtractedData(data)
            setPhase("extracted")
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
    }

    return (
        <div className="h-screen w-screen flex bg-gray-100">
            <SideBar
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
            />
        </div>
    )
}

function SideBar(props:{
    onUpload: (file:File)=> void,
    onHandleViewer:()=> void,
    onConfirm:() => void,
    onFinalize:() => void,
    onClear:() => void,
}){
    const fileInputRef = useRef<HTMLInputElement>(null)
    return (
        <aside className="w-64 bg-white border-1 flex flex-col p-4">
            <input
            ref={fileInputRef}
            type="file" 
            accept="applcation/pdf"
            id="pdfinput"
            style={{display:"none"}}
            onChange={(e) =>
                {
                const file = e.target.files?.[0]
                if(file) props.onUpload(file)
                }
            } 
            />
            <button onClick={props.onHandleViewer}>
                Visualizar dados
            </button>
            <button onClick={props.onFinalize}>
                Finalizar
            </button>
            <button onClick={props.onClear}>
                Excluir Arquivo
            </button>
        </aside>
    )
}

function MainArea({phase, loading, error}:MainAreaProps){
    return (
        <main className="flex-1 flex flex-col">
            <header className="h-12 bg-white border-b flex items-center px-4">
                <img src="/logo.png" className="w-5 h-5 opacity-60"/>
            </header>
            <section className="flex-1 flex items-center justify-center">
                {loading && <div>Loading...</div>}
                {!loading && error && (
                    <div className="text-red-500">{error}</div>
                )}
                {!loading && !error && !phase &&(
                    <EmptyState/>
                )}
                {!loading && phase && (
                    <div>Current phase:{phase}</div>
                )}
            </section>
        </main>
    )
}