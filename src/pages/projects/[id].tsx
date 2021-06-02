import {Flex, Heading, NumberInputField,  NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Icon, NumberInput, Table, Input, HStack, Tag, Button,Box,Text, Stack, SimpleGrid, theme, Thead, Tr, Th, Checkbox, Tbody, Td, useBreakpointValue, useToast, Spinner, Tabs, TabList, Tab, TabPanels, TabPanel, Textarea} from '@chakra-ui/react'
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { RiAddLine, RiArrowLeftRightFill, RiCheckboxBlankCircleFill, RiPencilLine } from 'react-icons/ri';
import { useQuery } from 'react-query';
import {Header} from '../../components/Header'
import { Pagination } from '../../components/Pagination';
import { Sidebar } from '../../components/Sidebar';
import { api } from '../../services/apiClient';
import { withSSRAuth } from '../../utils/withSSRAuth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {differenceInCalendarMonths, eachMonthOfInterval, parseISO} from 'date-fns'
import { getAvancoPrevisto, parseDate } from '../../utils/formatDate';


const  Chart = dynamic(() => import('react-apexcharts'), {
  ssr:false,
})




type Etapa = {
  etapa: string,
  startDate: string,
  finishDate: string,
  avancoPrevisto: number,
  avancoReal: number
}


type ProjectProps = {
    id:string,
    status: string,
    title: string,
    statusDate: string,
    startDate: string,
    finishDate: string,
    avancoPrevisto: number,
    avancoReal: number,
    updatedAt: string,
    updatedBy: string,
    etapas: Etapa[],

}

type history = {
  id: string,
  title: string,
  status: string,
  updatedAt: Date,
  avancoPrevisto: number,
  avancoReal: number,
}

type historyResponse = {
  data: history[]
}

export default function ProjectEdit(){

  
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  const router = useRouter()
  const toast = useToast()
  const {id} = router.query

  const { data, isLoading, error} = useQuery<ProjectProps>('project', async () => {
    const response = await api.get(`/projects/${id}`)

    const project:ProjectProps = {
      id: `${id}`,
      updatedBy: response.data.updatedBy,
      updatedAt: response.data.updatedAt,
      status: response.data.status,
      title: response.data.title,
      statusDate: response.data.statusDate,
      startDate: response.data.startDate,
      finishDate: response.data.finishDate,
      avancoPrevisto: response.data.avancoPrevisto,
      avancoReal: response.data.avancoReal,
      etapas: response.data.etapas
    }
    return project;
  })

  const history = useQuery<history[]>('history', async () => {
    const response = await api.get(`/projects/datalog/${id}`)

    
    return response.data.sort((a,b) => (a.statusDate > b.statusDate) ? 1 : -1);
  })

  const [project, setProject] = useState<ProjectProps>()
  const [loading, setLoading] = useState(false)
  const [showTimeline, setShowTimeLine] = useState(false)

  useEffect(()=>(
    setProject(data)
  ),[data])

  function createCategories(startDate:string, finishDate: string): Date[] {
    const categorias= []
    const diferenca = eachMonthOfInterval({
      start: new Date(Number(startDate?.split('-')[0]), Number(startDate?.split('-')[1]), Number(startDate?.split('-')[2])),
      end: new Date(Number(finishDate?.split('-')[0]), Number(finishDate?.split('-')[1]), Number(finishDate?.split('-')[2]))
    })

    diferenca.map(item => categorias.push(item))
    return categorias

  }


  const options = {
    chart: {
      type: 'rangeBar',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      foreColor: theme.colors.gray[500],
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        dataLabels: {
          hideOverflowingLabels: false
        }
      }
    },
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      formatter: function(val, opts) {
        var label = opts.w.globals.labels[opts.dataPointIndex]
        return label
      },
      style: {
        colors: ['#f3f4f5', '#fff']
      }
    },
    tooltip: {
      enabled: false
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      show: false,
      categories:[]
    },
    markers: {
      colors: ['#F44336', '#E91E63', '#9C27B0']
   },
    
  };
  

  function createChartData(etapas: Etapa[]) {
    const color = ['#008FFB', '#00E396', '#775DD0', '#FEB019', '#FF4560' , '#e67e22', '#bdc3c7' ]
    const data = []
    etapas?.map((item, index) =>
      data.push({
        x: item.etapa,
        y: [
          new Date(item.startDate).getTime(),
          new Date(item.finishDate).getTime(),
        ],
        fillColor: item.avancoReal === 0 && getAvancoPrevisto(item?.startDate, item?.finishDate, project?.statusDate)=== 0 ?  '#bdc3c7' : item.avancoReal < getAvancoPrevisto(item?.startDate, item?.finishDate, project?.statusDate)? '#FF4560' : '#00E396'
      })
    )
    const series = [{
      data: data
    }]

    return series
    
  }


  function updateEtapaField(index: number, field: string, value: any){
    let updadetProject = {...project}
    updadetProject.etapas[index][field] = value
    console.log(updadetProject)
    setProject(updadetProject)
  }

  function updateProjectField(field: string, value: any){
    let updadetProject = {...project}
    updadetProject[field] = value
    console.log(updadetProject)
    setProject(updadetProject)
  }

  async function handleSaveChangesToProject() {
    try {
      setLoading(true)
      const data = project
      await api.post(`/projects/${id}`, data).then(response => toast({
        title: "Projeto atualizado com sucesso",
        status: "success",
        duration: 9000,
        isClosable: true,
      }) ).catch(error => toast({
        title: "Erro na atualização do projeto.",
        description: "Tente novamente mais tarde.",
        status: "error",
        duration: 9000,
        isClosable: true,
      })).then(()=>setLoading(false))

      router.push('/projects')
    }catch(err) {
      console.log(err)
    }
  }

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p="8"
        >
          <Flex
            mb="4"
            justify="space-between"
            align="center"
          >
            <Heading size="md" fontWeight="normal">Detalhe do Projeto</Heading>
            <Flex flexDirection="column" textAlign="right">
              <Text color="gray.500" fontSize="smaller">Última atualização: {project?.updatedAt}</Text>
              <Text color="gray.500" fontSize="smaller">por {project?.updatedBy}</Text>
            </Flex>

          </Flex>
          <Stack>
            <Stack>
              <Text color="gray.300" fontSize="smaller">Nome do projeto</Text>
              <Text>{project?.title}</Text>
            </Stack>
            <HStack flex="1">
              <Stack>
                <Text color="gray.300" fontSize="smaller">Data de Início</Text>
                <Input name={`data-inicio-${project?.title}`} type="date" disabled defaultValue={project?.startDate} onChange={e => updateProjectField('startDate', e.target.value)}/>
              </Stack>
              <Stack>
                <Text color="gray.300" fontSize="smaller">Data de Conclusão</Text>
                <Input name={`data-fim-${project?.title}`} type="date" disabled  defaultValue={project?.finishDate} onChange={e => updateProjectField('finishDate', e.target.value)}/>
              </Stack>
              <Stack>
                <Text color="gray.300" fontSize="smaller">Av. Previsto</Text>
                <NumberInput colorScheme="gray.500" errorBorderColor="red.500" disabled name={`avanco-previsto-${project?.title}`} min={0} max={100}  value={getAvancoPrevisto(project?.startDate, project?.finishDate, project?.statusDate)} onChange={(value)=>updateProjectField('avancoPrevisto', Number(value))} >
                  <NumberInputField />
                </NumberInput>
              </Stack>
              <Stack>
                <Text color="gray.300" fontSize="smaller">Av. Real</Text>
                <NumberInput border="gray.500" errorBorderColor="red.500" disabled name={`avanco-previsto-${project?.title}`} min={0} max={100}  value={project?.avancoReal} onChange={(value)=>updateProjectField('avancoReal', Number(value))} >
                  <NumberInputField />
                </NumberInput>
              </Stack>
              <Stack>
                <Text color="gray.300" fontSize="smaller">Data de Status</Text>
                <Input name={`data-status-${project?.title}`} type="date" disabled  defaultValue={project?.statusDate}/>
              </Stack>
            </HStack>
          </Stack>

          <Tabs mt="8" colorScheme="pink" variant="unstyled" _focus={{
            borderColor: 'red',
            border: '100px'
    
          }}>
            <TabList>
              <Tab outline='none' _selected={{ color: "pink.500" }}>Entregas</Tab>
              <Tab outline='none' _selected={{ color: "pink.500" }}>Linha do Tempo</Tab>
              <Tab outline='none' _selected={{ color: "pink.500"}}>Histórico</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
              <Table mt="4" colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>Etapa</Th>
                    <Th>Início</Th>
                    <Th>Conclusão</Th>
                    <Th>Av. Previsto</Th>
                    <Th>Av. Real</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {project?.etapas?.map((item, index) => (
                    <Tr key={item.etapa}>
                      <Td>
                        <Icon as={RiCheckboxBlankCircleFill} color={item.avancoReal >= getAvancoPrevisto(item?.startDate, item?.finishDate, project?.statusDate) ? 'green.500' : 'red.500'} fontSize="16"/>
                      </Td>
                      <Td>
                        {item.etapa}
                      </Td>
                      <Td>{parseDate(item.startDate)}</Td>
                      <Td>{parseDate(item.finishDate)}</Td>
                      <Td>{getAvancoPrevisto(item.startDate, item.finishDate, project.statusDate)}</Td>
                      <Td>{item.avancoReal}</Td>
                  </Tr>
                  ))} 
                </Tbody>
              </Table>
              </TabPanel>
              <TabPanel>
                <Chart options={options} series={createChartData(project?.etapas)}type="rangeBar" height={350}/>
              </TabPanel>
              <TabPanel>
              <Table mt="4" colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th>Data</Th>
                    <Th>Av. Previsto</Th>
                    <Th>Av. Real</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {history?.data?.map((item, index) => (
                    <Tr key={item.id}>
                      <Td>{item.updatedAt}</Td>
                      <Td>{item.avancoPrevisto}</Td>
                      <Td>{item.avancoReal}</Td>
                      <Td>{item.status}</Td>
                  </Tr>
                  ))} 
                </Tbody>
              </Table>
              </TabPanel>
            </TabPanels>
          </Tabs>
                      
            

        
          <Text my="4" color="gray.300" fontSize="smaller">Status do projeto</Text>
          <Box
            
            borderRadius={8}
            bg="gray.800"
            
          >
      
            <Textarea disabled _disabled={{color:"white"}} display="flex" w="full" h="container.sm" over value={project?.status}  />
            
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}
export const getServerSideProps = withSSRAuth(async (ctx) => {

  return {
   props: {}
 }
})