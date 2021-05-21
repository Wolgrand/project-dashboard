import {Flex, Tooltip, Button,Box,Text, Stack, SimpleGrid, theme, Tag, HStack, StatHelpText, Progress, Icon, LinkBox, LinkOverlay} from '@chakra-ui/react'
import dynamic from 'next/dynamic';
import { format, compareAsc, parseISO } from 'date-fns'
import { useQuery } from 'react-query';
import { ContentSidebar } from '../../components/ContentSidebar';
import {Header} from '../../components/Header'
import { Sidebar } from '../../components/Sidebar'
import { api } from '../../services/apiClient';
import { withSSRAuth } from '../../utils/withSSRAuth';
import { useState, useEffect } from 'react';
import { parseDate } from '../../utils/formatDate';
import { RiInformationLine } from 'react-icons/ri';


type Etapa = {
  etapa: string,
  startDate: Date,
  finishDate: Date,
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
    status: string,

}


export default function Dashboard() {
  const { data, isLoading, error} = useQuery<ProjectProps[]>('projects', async () => {
    const response = await api.get('/projects')
    
    const projects = response.data.map(item => {
      
      return {
        id: item['ref']['@ref'].id,
        title: item.data.title,
        startDate: parseDate(item.data.startDate),
        finishDate: parseDate(item.data.finishDate),
        avancoPrevisto: item.data.avancoPrevisto,
        avancoReal: item.data.avancoReal,
        status: item.data.status
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
          {projectsList?.map(item=>(
            <LinkBox>
              <Box
                p={["6"]}
                bg="gray.800"
                borderRadius={8}
                transition="all"
                pb="4"
                key={Math.random().toString(36).substring(7)}
                _hover={{
                  transition: 'transform .3s ease-out',
                  transform: 'translate(0, -5px)'
                }}
              >
                <HStack mb="2" justify="left">
                  <Tag  colorScheme={item?.avancoPrevisto>item.avancoReal ? "red" : "green"}>{item?.avancoPrevisto>item.avancoReal ? "Atrasado" : "No prazo"}</Tag>
                  <Tag fontSize="small" fontWeight="bold">{item.avancoReal === 0 ? "Não iniciado" : item.avancoReal< 100 ? "Em andamento" : "Concluído"}</Tag>
                </HStack>
                <LinkOverlay href={`/projects/${item.id}`}>
                  <Stack spacing="0" mb="2">
                    <Text fontSize="x-small" fontWeight="bold" color="gray.400">Nome do Projeto</Text>
                    <Text fontSize="small">{item.title}</Text>
                  </Stack>
                </LinkOverlay>
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
            </LinkBox>
            

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