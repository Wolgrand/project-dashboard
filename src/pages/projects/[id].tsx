import {Flex, Heading, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Icon, NumberInput, Table, Input, HStack, Tag, Button,Box,Text, Stack, SimpleGrid, theme, Thead, Tr, Th, Checkbox, Tbody, Td, useBreakpointValue, useToast, Spinner} from '@chakra-ui/react'
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { RiAddLine, RiCheckboxBlankCircleFill, RiPencilLine } from 'react-icons/ri';
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
    updatedAt: string,
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
  const {id} = router.query

  const { data, isLoading, error} = useQuery<ProjectProps>('project', async () => {
    const response = await api.get(`/projects/${id}`)

    const project:ProjectProps = {
      id: `${id}`,
      updatedBy: response.data.updatedBy,
      updatedAt: response.data.updateAt,
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
                <NumberInput colorScheme="gray.500" errorBorderColor="red.500" disabled name={`avanco-previsto-${project?.title}`} min={0} max={100}  value={project?.avancoPrevisto} onChange={(value)=>updateProjectField('avancoPrevisto', Number(value))} >
                  <NumberInputField />
                </NumberInput>
              </Stack>
              <Stack>
                <Text color="gray.300" fontSize="smaller">Av. Real</Text>
                <NumberInput border="gray.500" errorBorderColor="red.500" disabled name={`avanco-previsto-${project?.title}`} min={0} max={100}  value={project?.avancoReal} onChange={(value)=>updateProjectField('avancoReal', Number(value))} >
                  <NumberInputField />
                </NumberInput>
              </Stack>
            </HStack>
          </Stack>
            
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
                    <Icon as={RiCheckboxBlankCircleFill} color={item.avancoReal >= item.avancoPrevisto ? 'green.500' : 'red.500'} fontSize="16"/>
                  </Td>
                  <Td>
                    {item.etapa}
                  </Td>
                  <Td>{parseDate(item.startDate)}</Td>
                  <Td>{parseDate(item.finishDate)}</Td>
                  <Td>{item.avancoPrevisto}</Td>
                  <Td>{item.avancoReal}</Td>
              </Tr>
              ))} 
              
                
            </Tbody>

          </Table>
          <Text my="4" color="gray.300" fontSize="smaller">Status do projeto</Text>
          <Box
            
            borderRadius={8}
            bg="gray.800"
            
          >
            <Text p="4" w="4xl" rounded="md" bg="gray.900" fontSize="medium">Status do projetoxssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</Text>
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