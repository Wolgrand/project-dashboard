import {Flex, Box, Heading,Stack, Divider, Table, Thead, Tbody, Tr, Td, Th, VStack, SimpleGrid, HStack, Button, Text} from '@chakra-ui/react'
import Link from 'next/link'
import { FormEvent, useState } from 'react';
import { Input } from '../../components/Form/Input';
import {Header} from '../../components/Header'
import { Sidebar } from '../../components/Sidebar';
import { api } from '../../services/apiClient';
import { withSSRAuth } from '../../utils/withSSRAuth';

export default function CreateProject(){
  const [projectTitle, setProjectTitle] = useState("")
  const [projectStartDate, setProjectStartDate] = useState("")
  const [projectFinishDate, setProjectFinishDate] = useState("")
  const [terrenoStartDate, setTerrenoStartDate] = useState("")
  const [terrenoFinishDate, setTerrenoFinishDate] = useState("")
  const [projetoStartDate, setProjetoStartDate] = useState("")
  const [projetoFinishDate, setProjetoFinishDate] = useState("")
  const [ambientalStartDate, setAmbientalStartDate] = useState("")
  const [ambientalFinishDate, setAmbientalFinishDate] = useState("")
  const [fundiarioStartDate, setFundiarioStartDate] = useState("")
  const [fundiarioFinishDate, setFundiarioFinishDate] = useState("")
  const [materiaisStartDate, setMateriaisStartDate] = useState("")
  const [materiaisFinishDate, setMateriaisFinishDate] = useState("")
  const [execucaoStartDate, setExecucaoStartDate] = useState("")
  const [execucaoFinishDate, setExecucaoFinishDate] = useState("")

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const project = {
      title: projectTitle,
      startDate: projectStartDate,
      finishDate: projectFinishDate,
      avancoPrevisto: 0,
      avancoReal: 0,
      etapas:[
        {etapa: "terreno", StartDate: terrenoStartDate, finishDate: terrenoFinishDate, avancoPrevisto: 0, avancoReal: 0},
        {etapa: "ambiental",StartDate: ambientalStartDate, finishDate: ambientalFinishDate, avancoPrevisto: 0, avancoReal: 0},
        {etapa: "fundiario",StartDate: fundiarioStartDate, finishDate: fundiarioFinishDate, avancoPrevisto: 0, avancoReal: 0},
        {etapa: "materiais",StartDate: materiaisStartDate, finishDate: materiaisFinishDate, avancoPrevisto: 0, avancoReal: 0},
        {etapa: "execucao",StartDate: execucaoStartDate, finishDate: execucaoFinishDate, avancoPrevisto: 0, avancoReal: 0}
      ]
    }
    try {
      await api.post('/projects/new', project)
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
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>
                  Aquisição de Terreno
                </Td>
                <Td><Input name="terreno-start-date" value={terrenoStartDate} onChange={e=>setTerrenoStartDate(e.target.value)} type="date"/></Td>
                <Td><Input name="terreno-finish-date" value={terrenoFinishDate} onChange={e=>setTerrenoFinishDate(e.target.value)} type="date"/></Td>
              </Tr>
              <Tr>
                <Td>
                  Elaboração de Projeto
                </Td>
                <Td><Input name="projeto-start-date" value={projetoStartDate} onChange={e=>setProjetoStartDate(e.target.value)} type="date"/></Td>
                <Td><Input name="projeto-finish-date" value={projetoFinishDate} onChange={e=>setProjetoFinishDate(e.target.value)} type="date"/></Td>
              </Tr>
              <Tr>
                <Td>
                  Licenciamento Ambiental
                </Td>
                <Td><Input name="ambiental-start-date" value={ambientalStartDate} onChange={e=>setAmbientalStartDate(e.target.value)} type="date"/></Td>
                <Td><Input name="ambiental-finish-date" value={ambientalFinishDate} onChange={e=>setAmbientalFinishDate(e.target.value)} type="date"/></Td>
              </Tr>
              <Tr>
                <Td>
                  Licenciamento Fundiário
                </Td>
                <Td><Input name="fundiario-start-date" value={fundiarioStartDate} onChange={e=>setFundiarioStartDate(e.target.value)} type="date"/></Td>
                <Td><Input name="fundiario-finish-date" value={fundiarioFinishDate} onChange={e=>setFundiarioFinishDate(e.target.value)} type="date"/></Td>
              </Tr>
              <Tr>
                <Td>
                Aquisição de Materiais
                </Td>
                <Td><Input name="materiais-start-date" value={materiaisStartDate} onChange={e=>setMateriaisStartDate(e.target.value)} type="date"/></Td>
                <Td><Input name="materiais-finish-date" value={materiaisFinishDate} onChange={e=>setMateriaisFinishDate(e.target.value)} type="date"/></Td>
              </Tr>
              <Tr>
                <Td>
                  Execução
                </Td>
                <Td><Input name="execucao-start-date" value={execucaoStartDate} onChange={e=>setExecucaoStartDate(e.target.value)} type="date"/></Td>
                <Td><Input name="execucao-finish-date" value={execucaoFinishDate} onChange={e=>setExecucaoFinishDate(e.target.value)} type="date"/></Td>
              </Tr>
            </Tbody>

          </Table>
          

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link  href="/users" passHref>
                <Button as="a" colorScheme="whiteAlpha">Cancelar</Button>
              </Link>
              <Button type="submit" colorScheme="pink">Salvar</Button>
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