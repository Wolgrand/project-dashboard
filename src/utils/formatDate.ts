import {differenceInDays} from 'date-fns'

export function parseDate(date:any) {
  const parsedDate = new Date(date.split('-')[0], date.split('-')[1]-1, date.split('-')[2])

  return parsedDate.toLocaleDateString('pt-BR')
}


export function getAvancoPrevisto(startDate:any, finishDate:any, statusDate?: any) {
  const parsedStartDate = new Date(startDate?.split('-')[0], startDate?.split('-')[1]-1, startDate?.split('-')[2])
  const parsedFinishDate = new Date(finishDate?.split('-')[0], finishDate?.split('-')[1]-1, finishDate?.split('-')[2])
  const parsedStatusDate = statusDate !== undefined ?  new Date(statusDate?.split('-')[0], statusDate?.split('-')[1]-1, statusDate?.split('-')[2]) : new Date()
  const daysToStatus = differenceInDays(parsedStartDate, parsedStatusDate)
  const daysToFinish = differenceInDays(parsedStartDate, parsedFinishDate)
  const avancoPrevisto = parsedStatusDate > parsedFinishDate ? 100 : ((daysToStatus/daysToFinish)*100).toLocaleString('pt-BR', { maximumFractionDigits: 0})


  return Number(avancoPrevisto) < 0 ? 0 : Number(avancoPrevisto)>= 100 ? 100 : avancoPrevisto
}

