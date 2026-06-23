

import type {TimeHm} from "@contracts"

type Props = {
  time: TimeHm
  editMode: boolean
  onHourChange: (value:number) => void
  onMinuteChange: (value:number) => void
}

export default function TimeEntryEditor({
  time,
  editMode,
  onHourChange,
  onMinuteChange
}: Props) {
  return (
    <div className="flex items-center gap-1">

      {editMode ? (
        <>
         <input
            type="number"
            value={time.h}
            onChange={(e) => {
            onHourChange(Number(e.target.value))
            }}
            className="w-14 border rounded px-1"
            />
        <span>:</span>
        <input
            type="number"
            value={time.m}
            onChange={(e) => {
            onMinuteChange(Number(e.target.value))
            }}
            className="w-14 border rounded px-1"
            />
        </>
      ) : (
        <span>
          {time.h.toString().padStart(2, "0")}:
          {time.m.toString().padStart(2, "0")}
        </span>
      )}

    </div>
  )
}
