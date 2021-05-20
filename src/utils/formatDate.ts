export function parseDate(date:any) {
  const parsedDate = new Date(date.split('-')[0], date.split('-')[1]-1, date.split('-')[2])

  return parsedDate.toLocaleDateString('pt-BR')
}