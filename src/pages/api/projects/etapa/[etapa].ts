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
    const { etapa } = req.query;

    

    try {
      const projects = await fauna.query<ProjectResponse>(
        q.Map(
          // iterate each item in result
          q.Paginate(
            // make paginatable
            q.Match(
              // query index
              q.Index('project_by_etapa'),
               etapa  // specify source
            )
          ),
          (ref) => q.Get(ref) // lookup each result by its reference
        )
      );
      // ok

      const response = projects.data.map(project => ({
        'id': project.ref.id,
        'title': project.data.title,
        'etapa': project.data.etapas.filter(item => item.etapa === etapa)
      }))
      
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