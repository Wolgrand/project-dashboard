import {Flex, Heading, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Icon, NumberInput, Table, Input, HStack, Tag, Button,Box,Text, Stack, SimpleGrid, theme, Thead, Tr, Th, Checkbox, Tbody, Td, useBreakpointValue, useToast, Spinner, Textarea, VStack} from '@chakra-ui/react'
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { RiAddLine, RiPencilLine } from 'react-icons/ri';
import { useQuery } from 'react-query';
import {Header} from '../../../components/Header'
import { Pagination } from '../../../components/Pagination';
import { Sidebar } from '../../../components/Sidebar';
import { api } from '../../../services/apiClient';
import { withSSRAuth } from '../../../utils/withSSRAuth';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { getAvancoPrevisto, parseDate } from '../../../utils/formatDate';
import { AuthContext } from '../../../contexts/AuthContext';
import { format } from 'date-fns';

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
    statusDate: string,
    startDate: string,
    finishDate: string,
    avancoPrevisto: number,
    avancoReal: number,
    status: string,
    updatedAt: Date,
    updatedBy: string,
    etapas: Etapa[],

}

export default function ProjectEdit(){
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  const router = useRouter()
  const toast = useToast()
  const { user } = useContext(AuthContext)
  const {id} = router.query

  const { data, isLoading, error} = useQuery<ProjectProps>('project', async () => {
    const response = await api.get(`/projects/${id}`)

    const project:ProjectProps = {
      id: `${id}`,
      title: response.data.title,
      startDate: response.data.startDate,
      finishDate: response.data.finishDate,
      statusDate:response.data.statusDate, 
      avancoPrevisto: response.data.avancoPrevisto,
      avancoReal: response.data.avancoReal,
      updatedBy: response.data.updatedBy,
      updatedAt: response.data.updatedAt,
      etapas: response.data.etapas,
      status: response.data.status
    }
    return project;
  })

  const [project, setProject] = useState<ProjectProps>()
  const [loading, setLoading] = useState(false)


  useEffect(()=>(
    setProject(data)
  ),[data])

  function updateAvacoPrevistoProjetoeEtapa(statusDate: string) {
    let updatedProject = {...project}
    updatedProject['statusDate'] = statusDate
    updatedProject.avancoPrevisto = Number(getAvancoPrevisto(project.startDate, project.finishDate, statusDate))
    updatedProject.etapas.map((item, index)=>(
      updatedProject.etapas[index]['avancoPrevisto'] = Number(getAvancoPrevisto(item.startDate, item.finishDate, statusDate))
    ))
    console.log(updatedProject)
    setProject(updatedProject)
  }

  function updateEtapaField(index: number, field: string, value: any){
    let updatedProject = {...project}
    updatedProject.etapas[index][field] = value
    updatedProject.updatedBy = user.name
    console.log(updatedProject)
    setProject(updatedProject)
  }

  function updateProjectField(field: string, value: any){
    let updatedProject = {...project}
    updatedProject[field] = value
    updatedProject.updatedBy = user.name
    console.log(updatedProject)
    setProject(updatedProject)
  }

  async function handleSaveChangesToProject() {
    try {
      setLoading(true)
      const data = project
      console.log(data)
      await api.post(`/projects/datalog/register/${id}`, data)
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
            <Heading size="lg" fontWeight="normal">Editar Projeto</Heading>
            <Flex flexDirection="column" textAlign="right">
              <Text color="gray.500" fontSize="smaller">Última atualização: {data?.updatedAt}</Text>
              <Text color="gray.500" fontSize="smaller">por {data?.updatedBy}</Text>
            </Flex>

          </Flex>
          <Stack>
            <HStack justifyContent="space-between">
              <Stack>
                <Text color="gray.300" fontSize="smaller">Nome do projeto</Text>
                <Text>{project?.title}</Text>
              </Stack>
            <Stack>
                <Text color="gray.300" fontSize="smaller">Data de Status</Text>
                <Input name={`data-status-${project?.title}`} type="date"  defaultValue={project?.statusDate} onChange={e => updateAvacoPrevistoProjetoeEtapa(e.target.value)}/>
              </Stack>
            </HStack>
            <HStack flex="1">
              <Stack>
                <Text color="gray.300" fontSize="smaller">Data de Início</Text>
                <Input name={`data-inicio-${project?.title}`} type="date"  defaultValue={project?.startDate} onChange={e => updateProjectField('startDate', e.target.value)}/>
              </Stack>
              <Stack>
                <Text color="gray.300" fontSize="smaller">Data de Conclusão</Text>
                <Input name={`data-fim-${project?.title}`} type="date"  defaultValue={project?.finishDate} onChange={e => updateProjectField('finishDate', e.target.value)}/>
              </Stack>
              <Stack>
                <Text color="gray.300" fontSize="smaller">Av. Previsto</Text>
                <NumberInput colorScheme="gray.500" isDisabled errorBorderColor="red.500" name={`avanco-previsto-${project?.title}`} min={0} max={100}  value={getAvancoPrevisto(project?.startDate, project?.finishDate, project?.statusDate)} >
                  <NumberInputField />
                </NumberInput>
              </Stack>
              <Stack>
                <Text color="gray.300" fontSize="smaller">Av. Real</Text>
                <NumberInput border="gray.500" errorBorderColor="red.500" name={`avanco-previsto-${project?.title}`} min={0} max={100}  value={project?.avancoReal} onChange={(value)=>updateProjectField('avancoReal', Number(value))} >
                  <NumberInputField />
                </NumberInput>
              </Stack>
            </HStack>
          </Stack>
            
          <Table mt="4" colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th>Etapa</Th>
                <Th>Data de Início</Th>
                <Th>Data de Conclusão</Th>
                <Th>Avanço Previsto</Th>
                <Th>Avanço Real</Th>
              </Tr>
            </Thead>
            <Tbody>
               {project?.etapas?.map((item, index) => (
                <Tr key={item.etapa}>
                  <Td>
                    {item.etapa}
                  </Td>
                  <Td><Input name={`data-inicio-${item}`} type="date"  defaultValue={item.startDate} onChange={e => updateEtapaField(index,'startDate', e.target.value)}/></Td>
                  <Td><Input name={`data-conclusao-${item}`} type="date"  defaultValue={item.finishDate} onChange={e => updateEtapaField(index,'finishDate', e.target.value)}/></Td>
                  <Td><Text>{getAvancoPrevisto(item.startDate, item.finishDate, project.statusDate)}</Text></Td>
                  <Td><Input name={`avanco-real-${item}`} type="number" min="0"  defaultValue={item.avancoReal} onChange={e => updateEtapaField(index,'avancoReal', Number(e.target.value))}/></Td>
              </Tr>
              ))} 
              
                
            </Tbody>

          </Table>
          <Text my="4" color="gray.300" fontSize="smaller">Status do projeto</Text>
          <Box
            
            borderRadius={8}
            bg="gray.800"
            
          >
            <Textarea display="flex" w="full" h="auto" value={project?.status} placeholder="Descreva o status do projeto informando o status de cada etapa..." onChange={e => updateProjectField('status', e.target.value)}  />
          </Box>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link  href="/projects" passHref>
                <Button as="a" colorScheme="whiteAlpha">Cancelar</Button>
              </Link>
              <Button colorScheme="pink" onClick={()=>handleSaveChangesToProject()}>{!loading ? "Atualizar" : <Spinner size="xs" />}</Button>
            </HStack>
          </Flex>
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