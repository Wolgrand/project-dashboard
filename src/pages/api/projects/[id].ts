import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";

type Etapa = {
  etapa: string,
  startDate: Date,
  finishDate: Date,
  avancoPrevisto: number,
  avancoReal: number
}


type ProjectResponse = {
  data: ProjectRes[]
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




export default async (req: NextApiRequest, res: NextApiResponse<ProjectResponse[] | any >) => {
  if(req.method === 'GET'){
    const { id } = req.query;

    

    try {
      const project = await fauna.query<ProjectResponse>(
        q.Get(q.Ref(q.Collection('projects'), id))
      );
      // ok

      const response = project.data
      
      // ok
      res.status(200).json(response);
    } catch (e) {
      // something went wrong
      res.status(500).json({ error: e.message });
    }
  }else {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Method not allowed')
  }
};