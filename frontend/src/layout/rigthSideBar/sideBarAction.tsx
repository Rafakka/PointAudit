
function RightSideBar(){
    return(
        <aside className="w-64 border-l bg-gray-50 p-4 flex flex-col gap-4">
            <SideAction active label="Inserir PDF" icon=""/>
            
            <div className="mt-6 space-y-2">
            <SideAction disable label="Visualizar"/>
            <SideAction disable label="Excluir Arquivo"/>
            </div>
        </aside>
    )
}

function SideAction({
    label,
    icon,
    active,
    disable,
}:{
    label:string;
    icon?:string;
    active?:boolean;
    disable?:boolean;
}) {
    return (
        <button
        disabled={disable}
        className={
            `flex items-center gap-2 px-3 py-2 rounded
            ${active ?"bg-cyan-500 text-white":""}
            ${disable ? "bg-gray-200 text-gray-400 cursor-not-allowed":""}
            ${!active && !disable ?"hover:bg-gray-100"}`
        }
            >
        {icon && <span>{icon}</span>}
        {label}
        </button>
    );
}