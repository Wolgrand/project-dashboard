import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../../../services/fauna";



type Etapa = {
  project_id: string,
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

type ProjectResponse = {
  data: ProjectRes[]
}
type ProjectRes = {
    ref: {
        id: string;
    },
    ts: string,
    data: Etapa
}

export default async (req: NextApiRequest, res: NextApiResponse<ProjectResponse[] | any>) => {
  if(req.method === 'GET'){
    const { id } = req.query;

    

    try {
      const projectHistory = await fauna.query<ProjectResponse>(
        q.Map(
          // iterate each item in result
          q.Paginate(
            // make paginatable
            q.Match(
              // query index
              q.Index('datalog_by_id'),
               id  // specify source
            )
          ),
          (ref) => q.Get(ref) // lookup each result by its reference
        )
      );
      // ok

      const response = projectHistory.data.map(project => ({
        'id': project.ref.id,
        'title': project.data.title,
        'status': project.data.status,
        'updatedAt': project.data.updatedAt,
        'avancoPrevisto': project.data.avancoPrevisto,
        'avancoReal': project.data.avancoReal
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