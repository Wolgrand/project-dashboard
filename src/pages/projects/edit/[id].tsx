import {Flex, Heading, Icon, Table, Input, HStack, Tag, Button,Box,Text, Stack, SimpleGrid, theme, Thead, Tr, Th, Checkbox, Tbody, Td, useBreakpointValue} from '@chakra-ui/react'
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { RiAddLine, RiPencilLine } from 'react-icons/ri';
import {Header} from '../../../components/Header'
import { Pagination } from '../../../components/Pagination';
import { Sidebar } from '../../../components/Sidebar';
import { withSSRAuth } from '../../../utils/withSSRAuth';

export default function UserList(){
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
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
            mb="4"
            justify="space-between"
            align="center"
          >
            <Heading size="lg" fontWeight="normal">Editar Projeto</Heading>
           

          </Flex>
            <Text color="gray.300" fontSize="smaller">Nome do projeto</Text>
            <Text>29295 - RECAPACITAÇÃO DO ALIMENTADOR DA SE SENADOR GUIOMARD</Text>
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
              <Tr>
                <Td>
                  Aquisição de Terreno
                </Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="date"  defaultValue="2021-01-02" /></Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="date"  defaultValue="2023-04-15" /></Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="number" min="0"  defaultValue="40" /></Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="number" min="0"  defaultValue="30" /></Td>
              </Tr>
              <Tr>
                <Td>
                  Elaboração de Projeto
                </Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="date"  defaultValue="2021-01-02" /></Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="date"  defaultValue="2023-04-15" /></Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="number" min="0"  defaultValue="40" /></Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="number" min="0"  defaultValue="30" /></Td>
              </Tr>
              <Tr>
                <Td>
                  Licenciamento Ambiental
                </Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="date"  defaultValue="2021-01-02" /></Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="date"  defaultValue="2023-04-15" /></Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="number" min="0"  defaultValue="40" /></Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="number" min="0"  defaultValue="30" /></Td>
              </Tr>
              <Tr>
                <Td>
                  Licenciamento Fundiário
                </Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="date"  defaultValue="2021-01-02" /></Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="date"  defaultValue="2023-04-15" /></Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="number" min="0"  defaultValue="40" /></Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="number" min="0"  defaultValue="30" /></Td>
              </Tr>
              <Tr>
                <Td>
                Aquisição de Materiais
                </Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="date"  defaultValue="2021-01-02" /></Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="date"  defaultValue="2023-04-15" /></Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="number" min="0"  defaultValue="40" /></Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="number" min="0"  defaultValue="30" /></Td>
              </Tr>
              <Tr>
                <Td>
                  Execução
                </Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="date"  defaultValue="2021-01-02" /></Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="date"  defaultValue="2023-04-15" /></Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="number" min="0"  defaultValue="40" /></Td>
                <Td><Input name="data-inicio-licenciamento-Fundiário" type="number" min="0"  defaultValue="30" /></Td>
              </Tr>
            </Tbody>

          </Table>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link  href="/users" passHref>
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