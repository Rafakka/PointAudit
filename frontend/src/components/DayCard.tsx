
import ObservationEditor from "../components/ObservationEditor.tsx"
import TimeEntryEditor from "../components/TimeEntryEditor.tsx"
import type {DayRecord, JobDocument} from "@contracts"

type Props = {
    day:DayRecord
    dayKey : string
    editMode: boolean

    setExtractedData: React.Dispatch <
    React.SetStateAction<JobDocument | null >
    >
}

export default function DayCard({
    day,
    dayKey,
    editMode,
    setExtractedData}:Props) {
    return (
        <div className="border-b pb-5">

        <div><strong>Data:</strong> {day.date}</div>
        <div><strong>Semana:</strong> {day.weekday}</div>


    <ObservationEditor
        day={day}
        dayKey={dayKey}
        editMode={editMode}
        setExtractedData={setExtractedData}
    />
   
  {/* Realizado */}
  <div className="mt-4">
    <strong>Realizado:</strong>

    <div className="flex flex-wrap gap-5 mt-2">
    {day.realizado.map((time, index) => (
        <TimeEntryEditor
            key={index}
            time={time}
            editMode={editMode}

            onHourChange={(newHour) => {
            setExtractedData(prev => {
            if (!prev) return prev

            const updatedDay = {
          ...prev.timesheet.dias[dayKey],
          realizado: prev.timesheet.dias[dayKey].realizado.map((t, i) =>
            i === index ? { ...t, h: newHour } : t
          )
        }

        return {
          ...prev,
          timesheet: {
            ...prev.timesheet,
            dias: {
              ...prev.timesheet.dias,
              [dayKey]: updatedDay
            }
          }
        }
      })
    }}

    onMinuteChange={(newMin) => {
      setExtractedData(prev => {
        if (!prev) return prev

        const updatedDay = {
          ...prev.timesheet.dias[dayKey],
          realizado: prev.timesheet.dias[dayKey].realizado.map((t, i) =>
            i === index ? { ...t, m: newMin } : t
          )
        }

        return {
          ...prev,
          timesheet: {
            ...prev.timesheet,
            dias: {
              ...prev.timesheet.dias,
              [dayKey]: updatedDay
                                    }
                                }
                            }
                        })
                    }}
                />
            ))}
        </div>
    </div>

    </div>
    )
    }

