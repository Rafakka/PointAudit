

import type {DayRecord, JobDocument} from "@contracts"

type Props = {
    day: DayRecord
    editMode: boolean
    dayKey: string

    setExtractedData: React.Dispatch <
    React.SetStateAction<JobDocument | null >
    >
}
 
export default function ObservationEditor({
    day,
    editMode,
    setExtractedData,
    dayKey
}:Props) {
    return (
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
                  [dayKey]: {
                    ...prev.timesheet.dias[dayKey],
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
        
    )
}

 
