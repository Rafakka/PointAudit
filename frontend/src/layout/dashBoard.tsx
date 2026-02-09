import EmptyState from "./mainPanel/emptyState"

export default function DashBoard(){
    return (
        <div className="h-screen w-screen flex bg-gray-100">
            <SideBar/>
            <MainArea/>
        </div>
    )
}

function SideBar(){
    return (
    <aside className="w-64 bg-white border-l flex flex-col p-4">
        <button className="flex items-center gap-2 mb-6">
        <img src="/input-file.png" className="w-6 h-6"/>
        <span className="font-semibold">Carregar PDF</span>
        </button>

        <div className="space-y-3 text-gray-400">
            
            <div>Visualizar</div>
            <button className="flex items-center gap-2 mb-6">
            <img src="/search-file.png" className="w-6 h-6"/>
            <span className="font-semibold">Visualizar dados</span>
            </button>

            <div>Excluir Arquivo</div>
            <button className="flex items-center gap-2 mb-6">
            <img src="/remove-file.png" className="w-6 h-6"/>
            <span className="font-semibold">Excluir Arquivo</span>
            </button>

        </div>
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