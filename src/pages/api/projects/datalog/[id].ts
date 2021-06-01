import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../../services/fauna";



type Etapa = {
  etapa: string,
  startDate: Date,
  finishDate: Date,
  avancoPrevisto: number,
  avancoReal: number
}

type ProjectReq = {
    title: string,
    startDate: Date,
    finishDate: Date,
    avancoPrevisto: string,
    avancoReal: string,
    statusDate: Date,
    status: string,
    updatedBy: string,
    updatedAt: Date,
    etapas: Etapa[]      
}


export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if(req.method === 'POST'){
    const {title, startDate, finishDate, etapas, avancoPrevisto, avancoReal, status, updatedBy, updatedAt, statusDate}:ProjectReq = req.body
    const { id } = req.query;


    try {
      const newLog = await fauna.query(
        q.Create(q.Collection('datalog'), {
          data: {
            project_id: id,
            title,
            startDate,
            finishDate,
            status,
            updatedBy,
            updatedAt,
            statusDate,
            avancoPrevisto,
            avancoReal,
            etapas
          },
        })
      );

      

      
      // ok
      res.status(200).end();
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
  }else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
}
};