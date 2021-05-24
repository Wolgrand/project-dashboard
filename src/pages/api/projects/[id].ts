import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";
import { format } from "date-fns";


type ProjectResponse = {
  data: ProjectRes[],
  ts: number
}
type ProjectRes = {
    ref: {
        id: string;
    },
    ts: string,
    data: {
      title: string,
      startDate: Date,
      finishDate: Date,
      avancoPrevisto: string,
      avancoReal: string,
      etapas: Etapa[] 
    }
}

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
    etapas: Etapa[]      
}




export default async (req: NextApiRequest, res: NextApiResponse<ProjectResponse[] | any >) => {
  if(req.method === 'GET'){
    const { id } = req.query;

    try {
      const project = await fauna.query<ProjectResponse>(
        q.Get(q.Ref(q.Collection('projects'), id))
      );
      // ok

      const response = project.data
      response['updateAt'] = format(new Date(project.ts / 1000), 'dd/MM/yyyy')
      
      // ok
      res.status(200).json(response);
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
  }else if(req.method === 'POST'){
    const { id } = req.query;
    const {title, startDate, finishDate, etapas, avancoPrevisto, avancoReal, status, updatedBy, statusDate}:ProjectReq = req.body;
    
    try {
      const updatedProject = await fauna.query(
        q.Update(q.Ref(q.Collection('projects'), id), {
          data: {
            title,
            startDate,
            finishDate,
            status,
            statusDate,
            updatedBy,
            etapas,
            avancoPrevisto,
            avancoReal
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