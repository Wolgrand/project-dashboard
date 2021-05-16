import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";


type ProjectReq = {
    title: string,
    startDate: Date,
    finishDate: Date,
    avancoPrevisto: string,
    avancoReal: string,
    etapas: {
      terreno?: {
        startDate: Date,
        finishDate: Date,
        avancoPrevisto: number,
        avancoReal: number
      },
      projeto?: {
        startDate: Date,
        finishDate: Date,
        avancoPrevisto: number,
        avancoReal: number
      },
      ambiental?: {
        startDate: Date,
        finishDate: Date,
        avancoPrevisto: number,
        avancoReal: number
      },
      fundiario?: {
        startDate: Date,
        finishDate: Date,
        avancoPrevisto: number,
        avancoReal: number
      },
      materiais?: {
        startDate: Date,
        finishDate: Date,
        avancoPrevisto: number,
        avancoReal: number
      },
      execução?: {
        startDate: Date,
        finishDate: Date,
        avancoPrevisto: number,
        avancoReal: number
      },
    
  }
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
    etapas: {
      terreno?: {
        startDate: Date,
        finishDate: Date,
        avancoPrevisto: number,
        avancoReal: number
      },
      projeto?: {
        startDate: Date,
        finishDate: Date,
        avancoPrevisto: number,
        avancoReal: number
      },
      ambiental?: {
        startDate: Date,
        finishDate: Date,
        avancoPrevisto: number,
        avancoReal: number
      },
      fundiario?: {
        startDate: Date,
        finishDate: Date,
        avancoPrevisto: number,
        avancoReal: number
      },
      materiais?: {
        startDate: Date,
        finishDate: Date,
        avancoPrevisto: number,
        avancoReal: number
      },
      execução?: {
        startDate: Date,
        finishDate: Date,
        avancoPrevisto: number,
        avancoReal: number
      },
    }
  }
}

export default async (req: NextApiRequest, res: NextApiResponse<ProjectRes | any >) => {
  if(req.method === 'POST'){
    const { title, startDate, finishDate, etapas, avancoPrevisto, avancoReal }:ProjectReq = req.body;

    try {
      const newProject = await fauna.query<ProjectRes>(
        q.Create(q.Collection('projects'), {
          data: {
            title,
            startDate,
            finishDate,
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