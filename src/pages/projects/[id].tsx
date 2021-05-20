import {Flex, Heading, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Icon, NumberInput, Table, Input, HStack, Tag, Button,Box,Text, Stack, SimpleGrid, theme, Thead, Tr, Th, Checkbox, Tbody, Td, useBreakpointValue, useToast, Spinner} from '@chakra-ui/react'
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { RiAddLine, RiPencilLine } from 'react-icons/ri';
import { useQuery } from 'react-query';
import {Header} from '../../components/Header'
import { Pagination } from '../../components/Pagination';
import { Sidebar } from '../../components/Sidebar';
import { api } from '../../services/apiClient';
import { withSSRAuth } from '../../utils/withSSRAuth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { parseDate } from '../../utils/formatDate';

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
    startDate: string,
    finishDate: string,
    avancoPrevisto: number,
    avancoReal: number,
    etapas: Etapa[],

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
      title: response.data.title,
      startDate: response.data.startDate,
      finishDate: response.data.finishDate,
      avancoPrevisto: response.data.avancoPrevisto,
      avancoReal: response.data.avancoReal,
      etapas: response.data.etapas
    }
    return project;
  })

  const [project, setProject] = useState<ProjectProps>()
  const [loading, setLoading] = useState(false)


  useEffect(()=>(
    setProject(data)
  ),[data])

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
            <Heading size="lg" fontWeight="normal">Editar Projeto</Heading>
           

          </Flex>
          <Stack>
            <Stack>
              <Text color="gray.300" fontSize="smaller">Nome do projeto</Text>
              <Text>{project?.title}</Text>
            </Stack>
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
                <NumberInput colorScheme="gray.500" errorBorderColor="red.500" name={`avanco-previsto-${project?.title}`} min={0} max={100}  value={project?.avancoPrevisto} onChange={(value)=>updateProjectField('avancoPrevisto', Number(value))} >
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
                  <Td><Input name={`avanco-previsto-${item}`} type="number" min="0"  defaultValue={item.avancoPrevisto} onChange={e => updateEtapaField(index,'avancoPrevisto', Number(e.target.value))}/></Td>
                  <Td><Input name={`avanco-real-${item}`} type="number" min="0"  defaultValue={item.avancoReal} onChange={e => updateEtapaField(index,'avancoReal', Number(e.target.value))}/></Td>
              </Tr>
              ))} 
              
                
            </Tbody>

          </Table>
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