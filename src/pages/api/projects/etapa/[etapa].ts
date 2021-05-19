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
      etapas: {}
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
              q.Index('all_projects')
                 // specify source
            )
          ),
          (ref) => q.Get(ref) // lookup each result by its reference
        )
      );
      // ok
      
      const response = projects.data.filter(project => 
        project.data.etapas[etapa.toString()]
      ).map(item => ({
        'id': item.ref.id,
        'title': item.data.title,
        'etapa': item.data.etapas[etapa.toString()]
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