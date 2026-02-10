import { useState } from "react"
import { clearInput } from "../api/delete"
import EmptyState from "./mainPanel/emptyState"

type PipelinePhase =
| "ingested"
| "extracted"
| "confirmed"
| "finalized"

interface JobState {
    phase:PipelinePhase
    creatAt?:string
    updatedAt?:string
}

const [jobDir, setJobDir] = useState<string | null>(null)
const [state, setState] = useState<JobState | null>(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)


export default function DashBoard(){
    return (
        <div className="h-screen w-screen flex bg-gray-100">
            <SideBar
            onUpload={handleUpload}
            onConfirm={handleConfirm}
            onFinalize={handleFinalize}
            onClear={handleClear}
            
            />
            <MainArea/>
        </div>
    )

    function handleUpload(){
        console.log("Upload")
    }
    function handleConfirm(){
        console.log("Confirm")
    }
    function handleFinalize(){
        console.log("Finalize")
    }
    function handleClear(){
        console.log("Clear")
    }
}

function SideBar({
    onUpload,
    onConfirm,
    onFinalize,
    onClear,
}:{
    onUpload:() => void
    onConfirm:() => void
    onFinalize:() => void
    onClear:() => void
}) {
    return (
        <aside className="w-64 bg-white border-1 flex flex-col p-4">
            <button onClick={onUpload}>
                CarregarPDf
            </button>
            <button onClick={onConfirm}>
                Visualizar dados
            </button>
            <button onClick={onFinalize}>
                Finalizar
            </button>
            <button onClick={onClear}>
                Excluir Arquivo
            </button>
        </aside>
    )
}

function MainArea(){
    return (
        <main className="flex-1 flex flex-col">
            <header className="h-12 bg-white border-b flex items-center px-4">
                <img src="/logo.png" className="w-5 h-5 opacity-60"/>
            </header>
            <section className="flex-1 flex items-center justify-center">
                <EmptyState/>
            </section>
        </main>
    )
}