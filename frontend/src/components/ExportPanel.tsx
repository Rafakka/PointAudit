
interface ExportPanelProps {
    onJson: () => void
    onPdf: () => void
    onXlsx: () => void
}

export function ExportPanel(props: ExportPanelProps) {
    return (
        <div className="bg-white rounded shadow p-4 mt-4">

            <h2 className="font-semibold text-gray-700">
                Escolha o formato de exportação
            </h2>

            <div className="flex gap-2 mt-4">

                <button onClick={props.onJson}>
                    JSON
                </button>

                <button onClick={props.onXlsx}>
                    PDF
                </button>

                <button onClick={props.onPng}>
                    PNG
                </button>

            </div>

        </div>
    )
}
