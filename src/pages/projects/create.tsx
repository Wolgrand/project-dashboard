import {Flex, Checkbox, Box, Center, Heading,Stack, Divider, Table, Thead, Tbody, Tr, Td, Th, VStack, SimpleGrid, HStack, Button, Text, useToast, Icon, Spinner} from '@chakra-ui/react'
import Link from 'next/link'
import router from 'next/router';
import { FormEvent, useState } from 'react';
import { RiPencilLine } from 'react-icons/ri';
import { Input } from '../../components/Form/Input';
import {Header} from '../../components/Header'
import { Sidebar } from '../../components/Sidebar';
import { api } from '../../services/apiClient';
import { parseDate } from '../../utils/formatDate';
import { withSSRAuth } from '../../utils/withSSRAuth';

export default function CreateProject(){
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [projectTitle, setProjectTitle] = useState("")
  const [projectStartDate, setProjectStartDate] = useState("")
  const [projectFinishDate, setProjectFinishDate] = useState("")
  const [terrenoStartDate, setTerrenoStartDate] = useState("")
  const [terrenoFinishDate, setTerrenoFinishDate] = useState("")
  const [terrenoApplicable, setTerrenoApplicable] = useState(true)
  const [projetoStartDate, setProjetoStartDate] = useState("")
  const [projetoFinishDate, setProjetoFinishDate] = useState("")
  const [projetoApplicable, setProjetoApplicable] = useState(true)
  const [ambientalStartDate, setAmbientalStartDate] = useState("")
  const [ambientalFinishDate, setAmbientalFinishDate] = useState("")
  const [ambientalApplicable, setAmbientalApplicable] = useState(true)
  const [fundiarioStartDate, setFundiarioStartDate] = useState("")
  const [fundiarioFinishDate, setFundiarioFinishDate] = useState("")
  const [fundiarioApplicable, setFundiarioApplicable] = useState(true)
  const [materiaisStartDate, setMateriaisStartDate] = useState("")
  const [materiaisFinishDate, setMateriaisFinishDate] = useState("")
  const [materiaisApplicable, setMateriaisApplicable] = useState(true)
  const [execucaoStartDate, setExecucaoStartDate] = useState("")
  const [execucaoFinishDate, setExecucaoFinishDate] = useState("")
  const [execucaoApplicable, setExecucaoApplicable] = useState(true)



  async function handleSubmit(event: FormEvent) {
    event.preventDefault()


    const project = {
      title: projectTitle,
      startDate: projectStartDate,
      finishDate: projectFinishDate,
      avancoPrevisto: 0,
      avancoReal: 0,
      etapas:[]
    }


    terrenoApplicable ? project.etapas.push({etapa:'terreno', startDate: terrenoStartDate, finishDate: terrenoFinishDate, avancoPrevisto: 0, avancoReal: 0}) : null
    projetoApplicable ? project.etapas.push( {etapa:'projeto', startDate: projetoStartDate, finishDate: projetoFinishDate, avancoPrevisto: 0, avancoReal: 0}) : null
    ambientalApplicable ? project.etapas.push( {etapa:'ambiental', startDate: ambientalStartDate, finishDate: ambientalFinishDate, avancoPrevisto: 0, avancoReal: 0}) : null
    fundiarioApplicable ? project.etapas.push( {etapa:'fundiario', startDate: fundiarioStartDate, finishDate: fundiarioFinishDate, avancoPrevisto: 0, avancoReal: 0}) : null
    materiaisApplicable ? project.etapas.push( {etapa:'materiais', startDate: materiaisStartDate, finishDate: materiaisFinishDate, avancoPrevisto: 0, avancoReal: 0}) : null
    execucaoApplicable ? project.etapas.push( {etapa:'execucao', startDate: execucaoStartDate, finishDate: execucaoFinishDate, avancoPrevisto: 0, avancoReal: 0}) : null

    

    try {
      setIsLoading(true)
      await api.post('/projects/new', project).then(response => toast({
        title: "Projeto criado com sucesso",
        status: "success",
        duration: 9000,
        isClosable: true,
      }) ).catch(error => toast({
        title: "Erro ao criar novo projeto.",
        description: "Tente novamente mais tarde.",
        status: "error",
        duration: 9000,
        isClosable: true,
      })).then(()=>setIsLoading(false)).finally(()=>router.push('/projects'))
    } catch (err) {
      console.log(err)
    } 

    return;
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
          p={["6", "8"]}
        >
          <Heading size="lg" fontWeight="normal">Criar projeto</Heading>

          <Divider my="6" borderColor="gray.700"/>
          <Flex
            as="form"
            onSubmit={handleSubmit}
          >
            <Stack flex="1">

            <Input mb="2" name="project-title" value={projectTitle} onChange={e=>setProjectTitle(e.target.value)} type="text"  placeholder="Nome do projeto" />
            <HStack>
            <Input name="project-start-date" value={projectStartDate} onChange={e=>setProjectStartDate(e.target.value)} type="date"  label="Início do Projeto" />
            <Input name="project-finish-date" value={projectFinishDate} onChange={e=>setProjectFinishDate(e.target.value)} type="date"  label="Fim do Projeto" />
    
            </HStack>
            <Table mt="4" colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th>Etapa</Th>
                <Th>Data de Início</Th>
                <Th>Data de Conclusão</Th>
                <Th>Não se Aplica</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td color={terrenoApplicable ? null : 'gray.600'}>
                  Aquisição de Terreno
                </Td>
                <Td><Input name="terreno-start-date" isDisabled={!terrenoApplicable} value={terrenoStartDate} onChange={e=>setTerrenoStartDate(e.target.value)} type="date"/></Td>
                <Td><Input name="terreno-finish-date" isDisabled={!terrenoApplicable} value={terrenoFinishDate} onChange={e=>setTerrenoFinishDate(e.target.value)} type="date"/></Td>
                <Td px={["4", "4", "6"]}>
                  <Center><Checkbox my='auto' mx="0" colorScheme="pink" onChange={e=>setTerrenoApplicable(!e.target.checked)}/></Center>
                </Td>
              </Tr>
              <Tr>
                <Td color={projetoApplicable ? null : 'gray.600'}>
                  Elaboração de Projeto
                </Td>
                <Td><Input name="projeto-start-date" isDisabled={!projetoApplicable} value={projetoStartDate} onChange={e=>setProjetoStartDate(e.target.value)} type="date"/></Td>
                <Td><Input name="projeto-finish-date" isDisabled={!projetoApplicable} value={projetoFinishDate} onChange={e=>setProjetoFinishDate(e.target.value)} type="date"/></Td>
                <Td>
                  <Center><Checkbox my='auto' mx="0" colorScheme="pink" onChange={e=>setProjetoApplicable(!e.target.checked)}/></Center>
                </Td>
              </Tr>
              <Tr>
                <Td color={ambientalApplicable ? null : 'gray.600'}>
                  Licenciamento Ambiental
                </Td>
                <Td><Input name="ambiental-start-date" isDisabled={!ambientalApplicable} value={ambientalStartDate} onChange={e=>setAmbientalStartDate(e.target.value)} type="date"/></Td>
                <Td><Input name="ambiental-finish-date" isDisabled={!ambientalApplicable} value={ambientalFinishDate} onChange={e=>setAmbientalFinishDate(e.target.value)} type="date"/></Td>
                <Td justifyContent="center" px={["4", "4", "6"]}>
                  <Center><Checkbox my='auto' mx="0" colorScheme="pink" onChange={e=>setAmbientalApplicable(!e.target.checked)}/></Center>
                </Td>
              </Tr>
              <Tr>
                <Td color={fundiarioApplicable ? null : 'gray.600'}>
                  Licenciamento Fundiário
                </Td>
                <Td><Input name="fundiario-start-date" isDisabled={!fundiarioApplicable} value={fundiarioStartDate} onChange={e=>setFundiarioStartDate(e.target.value)} type="date"/></Td>
                <Td><Input name="fundiario-finish-date" isDisabled={!fundiarioApplicable} value={fundiarioFinishDate} onChange={e=>setFundiarioFinishDate(e.target.value)} type="date"/></Td>
                <Td justifyContent="center" px={["4", "4", "6"]}>
                  <Center><Checkbox my='auto' mx="0" colorScheme="pink" onChange={e=>setFundiarioApplicable(!e.target.checked)}/></Center>
                </Td>
              </Tr>
              <Tr>
                <Td color={materiaisApplicable ? null : 'gray.600'}>
                Aquisição de Materiais
                </Td>
                <Td><Input name="materiais-start-date" isDisabled={!materiaisApplicable} value={materiaisStartDate} onChange={e=>setMateriaisStartDate(e.target.value)} type="date"/></Td>
                <Td><Input name="materiais-finish-date" isDisabled={!materiaisApplicable} value={materiaisFinishDate} onChange={e=>setMateriaisFinishDate(e.target.value)} type="date"/></Td>
                <Td justifyContent="center" px={["4", "4", "6"]}>
                  <Center><Checkbox my='auto' mx="0" colorScheme="pink" onChange={e=>setMateriaisApplicable(!e.target.checked)}/></Center>
                </Td>
              </Tr>
              <Tr>
                <Td color={execucaoApplicable ? null : 'gray.600'}>
                  Execução
                </Td>
                <Td><Input name="execucao-start-date" isDisabled={!execucaoApplicable} value={execucaoStartDate} onChange={e=>setExecucaoStartDate(e.target.value)} type="date"/></Td>
                <Td><Input name="execucao-finish-date" isDisabled={!execucaoApplicable} value={execucaoFinishDate} onChange={e=>setExecucaoFinishDate(e.target.value)} type="date"/></Td>
                <Td justifyContent="center" px={["4", "4", "6"]}>
                  <Center><Checkbox my='auto' mx="0" colorScheme="pink" onChange={e=>setExecucaoApplicable(!e.target.checked)}/></Center>
                </Td>
              </Tr>
            </Tbody>

          </Table>
          

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link  href="/projects" passHref>
                <Button as="a" colorScheme="whiteAlpha">Cancelar</Button>
              </Link>
              <Button type="submit" colorScheme="pink">{!isLoading ? "Salvar" : <Spinner size="xs" />}</Button>
            </HStack>
          </Flex>
          </Stack>
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