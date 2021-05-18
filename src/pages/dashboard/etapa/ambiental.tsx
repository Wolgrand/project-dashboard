import {Flex, Button,Box,Text, Stack, SimpleGrid, theme, Tag, HStack, StatHelpText, Progress} from '@chakra-ui/react'
import dynamic from 'next/dynamic';
import { format, compareAsc, parseISO } from 'date-fns'
import { useQuery } from 'react-query';
import { ContentSidebar } from '../../../components/ContentSidebar';
import {Header} from '../../../components/Header'
import { Sidebar } from '../../../components/Sidebar'
import { api } from '../../../services/apiClient';
import { withSSRAuth } from '../../../utils/withSSRAuth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

type Etapa = {
  etapa: string,
  startDate: string,
  finishDate: string,
  avancoPrevisto: number,
  avancoReal: number
}


type ProjectProps = {
    id:string,
    title: string,
    startDate: Date,
    finishDate: Date,
    avancoPrevisto: number,
    avancoReal: number,
    etapas: Etapa[]

}


export default function Dashboard() {
  const router = useRouter()
  const page = router.asPath

  const path = {
    etapa: page.split('/')[3]
  }

  
  const { data, isLoading, error} = useQuery<ProjectProps[]>('projects', async () => {
    const response = await api.get(`/projects/etapa/${path.etapa}`)

   
    const projects = response.data.map((project) => {
      return {
        id: project.id,
        title: project.title,
        etapa: project.etapa[0].etapa,
        startDate: project.etapa[0].startDate,
        finishDate: project.etapa[0].finishDate,
        avancoPrevisto: project.etapa[0].avancoPrevisto,
        avancoReal: project.etapa[0].avancoReal,
      };
    })
    return projects.sort((a,b) => (a.title > b.title) ? 1 : -1);
  })

  const [projectsList, setProjectsList] = useState<ProjectProps[]>([])
  const [allProjects, setAllProjects] = useState(0)
  const [projectsOnTime, setProjectsOnTime] = useState(0)
  const [projectsWithDelay, setProjectsWithDelay] = useState(0)
  const [projectsNotStarted, setProjectsNotStarted] = useState(0)
  const [projectsOnGoing, setProjectsOnGoing] = useState(0)
  const [projectsFinished, setProjectsFinished] = useState(0)

  const projectOnTime = data?.filter(item => item.avancoPrevisto <= item.avancoReal).length
  const projectWithDelay = data?.filter(item => item.avancoPrevisto > item.avancoReal).length
  const projectNotStarted = data?.filter(item => item.avancoReal === 0).length
  const projectOnTGoing= data?.filter(item => item.avancoReal > 0 && item.avancoReal < 100).length
  const projectFinished= data?.filter(item => item.avancoReal === 100).length

  useEffect(()=>(

    setProjectsList(data),
    setAllProjects(data?.length),
    setProjectsOnTime(projectOnTime),
    setProjectsWithDelay(projectWithDelay),
    setProjectsNotStarted(projectNotStarted),
    setProjectsOnGoing(projectOnTGoing),
    setProjectsFinished(projectFinished)

  ),[data])



  function handleFilter(key: string) {

    switch (key) {
      case 'No prazo':
        setProjectsList(data.filter(item => item.avancoPrevisto <= item.avancoReal))
        break;

      case 'Atrasado':
        setProjectsList(data.filter(item => item.avancoPrevisto > item.avancoReal))
        break;

      case 'Não iniciado':
        setProjectsList(data.filter(item => item.avancoReal === 0))
        break;

      case 'Em andamento':
        setProjectsList(data.filter(item => item.avancoReal > 0 && item.avancoReal < 100 ))
        break;

      case 'Concluído':
        setProjectsList(data.filter(item => item.avancoReal === 100 ))
        break;

      case 'Todos':
        setProjectsList(data)
        break;
    
      default:
        break;
    }
  }


  return (
    <Flex direction="column" h="100vh">
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        
        <ContentSidebar />
        <Flex direction="column" flex="1">

        <Box
              px={["4"]}
              py={["2"]}
              bg="gray.800"
              borderRadius={8}
              pb="4"
              mb="4"
              key={Math.random().toString(36).substring(7)}
            >
              <Text fontSize="x-small" fontWeight="bold" color="gray.400">Filtro por Status</Text>
              <HStack mt="2" justify="flex-start">
                <Tag fontSize="small" fontWeight="bold" cursor="pointer" onClick={()=> handleFilter('Todos')}>Todos ({allProjects})</Tag>
                <Tag  colorScheme={'green'} cursor="pointer" onClick={()=> handleFilter('No prazo')}>No prazo ({projectsOnTime})</Tag>
                <Tag  colorScheme={'red'} cursor="pointer" onClick={()=> handleFilter('Atrasado')}>Atrasado ({projectsWithDelay})</Tag>
                <Tag fontSize="small" fontWeight="bold" cursor="pointer" onClick={()=> handleFilter('Não iniciado')}>Não iniciado ({projectsNotStarted})</Tag>
                <Tag fontSize="small" fontWeight="bold" cursor="pointer" onClick={()=> handleFilter('Em andamento')}>Em andamento ({projectsOnGoing})</Tag>
                <Tag fontSize="small" fontWeight="bold" cursor="pointer" onClick={()=> handleFilter('Concluido')}>Concluido ({projectsFinished})</Tag>
              </HStack>
            </Box>
        <SimpleGrid mb="4"  gap="4" minChildWidth="256px" align="flex-start">
          {projectsList?.length === 0 ?
            <Text>Nenhum projeto encontrado.</Text>

            : projectsList?.map(item=>(
            <Box
              p={["6"]}
              bg="gray.800"
              borderRadius={8}
              pb="4"
              key={Math.random().toString(36).substring(7)}
            >
              <HStack mb="2" justify="space-between">
                <Tag  colorScheme={item?.avancoPrevisto>item.avancoReal ? "red" : "green"}>{item?.avancoPrevisto>item.avancoReal ? "Atrasado" : "No prazo"}</Tag>
                <Tag fontSize="small" fontWeight="bold">{item.avancoReal === 0 ? "Não iniciado" : item.avancoReal< 100 ? "Em andamento" : "Concluído"}</Tag>
              </HStack>
              <Stack spacing="0" mb="2">
                <Text fontSize="x-small" fontWeight="bold" color="gray.400">Nome do Projeto</Text>
                <Text fontSize="small">{item.title}</Text>
              </Stack>
              <HStack justifyContent="space-between" mb="2">
                <Stack spacing="0">
                  <Text fontSize="x-small" fontWeight="bold" color="gray.400">Prev. de Início</Text>
                  <Text fontSize="medium">{item.startDate}</Text>
                </Stack>
                <Stack spacing="0">
                  <Text fontSize="x-small" fontWeight="bold" color="gray.400">Prev. de Conclusão</Text>
                  <Text fontSize="medium">{item.finishDate}</Text>
                </Stack>
              </HStack>
              <HStack justifyContent="space-between">
                <Stack spacing="0">
                  <Text fontSize="x-small" fontWeight="bold" color="gray.400">Avanço Previsto</Text>
                  <Text fontSize="medium">{item.avancoPrevisto}%</Text>
                </Stack>
                <Stack spacing="0">
                  <Text fontSize="x-small" fontWeight="bold" color="gray.400">Avanço Real</Text>
                  <Text fontSize="medium">{item.avancoReal}%</Text>
                </Stack>
              </HStack>
            </Box>

          ))}
          
        </SimpleGrid>
        </Flex>
      </Flex>
    </Flex>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {

  return {
   props: {}
 }
})