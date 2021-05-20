import {Flex, Heading, Icon, Table, Button,Box,Text, Stack, SimpleGrid, theme, Thead, Tr, Th, Checkbox, Tbody, Td, useBreakpointValue, Center} from '@chakra-ui/react'
import { format, parseISO } from 'date-fns';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { RiAddLine, RiPencilLine } from 'react-icons/ri';
import { useQuery } from 'react-query';
import {Header} from '../../components/Header'
import { Pagination } from '../../components/Pagination';
import { Sidebar } from '../../components/Sidebar';
import { api } from '../../services/apiClient';
import { parseDate } from '../../utils/formatDate';
import { withSSRAuth } from '../../utils/withSSRAuth';

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
    updatedAt: Date,
    avancoPrevisto: number,
    avancoReal: number,

}

export default function Project(){
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  const { data, isLoading, error} = useQuery<ProjectProps[]>('projects', async () => {
    const response = await api.get('/projects')
    
    const projects = response.data.map(project => {
      return {
        id: project['ref']['@ref'].id,
        updatedAt: format(new Date(project.ts / 1000), 'dd/MM/yyyy'),
        title: project.data.title,
        startDate: parseDate(project.data.startDate),
        finishDate: parseDate(project.data.finishDate),
        avancoPrevisto: project.data.avancoPrevisto,
        avancoReal: project.data.avancoReal,
      };
    })
    return projects.sort((a,b) => (a.title > b.title) ? 1 : -1);
  })


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
            mb="8"
            justify="space-between"
            align="center"
          >
            <Heading size="lg" fontWeight="normal">Projetos</Heading>

            <Link  href="/projects/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="pink"
                leftIcon={<Icon as={RiAddLine} fontSize="20"/>}
              >
                Criar novo
              </Button>
            </Link>

          </Flex>
          <Table colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th>Projeto</Th>
                <Th>Data de Início</Th>
                <Th>Data de Conclusão</Th>
                <Th>Data de Atualização</Th>
                <Th w="8"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {data && data?.map(item =>(
                <Tr key={item.id}>
                <Td>
                  <Box>
                    <Text fontWeight="bold" >{item.title}</Text>
                  </Box>
                </Td>
                <Td >{item.startDate}</Td>
                <Td>{item.finishDate}</Td>
                <Td>{item.updatedAt}</Td>
                <Td>
                  <Link href={`/projects/edit/${item.id}`} passHref>
                      <Button
                        as="a"
                        size="sm"
                        fontSize="sm"
                        colorScheme="purple"
                        leftIcon={<Icon as={RiPencilLine} fontSize="16"/>}
                      >
                        {isWideVersion && "Editar"}
                      </Button>
                  </Link>
                </Td>
              </Tr>
              ))}
            </Tbody>
          </Table>
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