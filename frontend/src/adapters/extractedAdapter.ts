import { type ExtractedResponse } from "../types/pipeline"

export function unWrapExtracted(response:ExtractedResponse){
    return{
        personal:{
            meta:response.data.personal.data.meta
        },
        person:response.data.personal.data.person,
        timesheet:{
            meta:response.data.timesheet.data.meta,
            dias:response.data.timesheet.data.dias
        }
    }
}
