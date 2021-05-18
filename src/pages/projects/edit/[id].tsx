import {Flex, Heading, Icon, Table, Input, HStack, Tag, Button,Box,Text, Stack, SimpleGrid, theme, Thead, Tr, Th, Checkbox, Tbody, Td, useBreakpointValue} from '@chakra-ui/react'
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

export default function PriojectEdit(){
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  const router = useRouter()
  const {id} = router.query

  const { data, isLoading, error} = useQuery<ProjectProps>('projects', async () => {
    const response = await api.get(`/projects/${id}`)
    return response.data;
  })

  const etapas = {}



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
            <Text color="gray.300" fontSize="smaller">Nome do projeto</Text>
            <Text>{data?.title}</Text>
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
              {data?.etapas.map(etapa => (
                <Tr key={etapa.etapa}>
                  <Td>
                    {etapa.etapa}
                  </Td>
                  <Td><Input name={`data-inicio-${etapa.etapa}`} type="date"  defaultValue={etapa.startDate}/></Td>
                  <Td><Input name={`data-conclusao-${etapa.etapa}`} type="date"  defaultValue={etapa.finishDate}/></Td>
                  <Td><Input name={`avanco-previsto-${etapa.etapa}`} type="number" min="0"  defaultValue={etapa.avancoPrevisto}/></Td>
                  <Td><Input name={`avanco-real-${etapa.etapa}`} type="number" min="0"  defaultValue={etapa.avancoReal}/></Td>
              </Tr>
              ))}
              
                
            </Tbody>

          </Table>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link  href="/projects" passHref>
                <Button as="a" colorScheme="whiteAlpha">Cancelar</Button>
              </Link>
              <Button colorScheme="pink">Atualizar</Button>
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