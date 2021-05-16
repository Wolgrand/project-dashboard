import {Flex, Button,Box,Text, Stack, SimpleGrid, theme, Tag, HStack, StatHelpText, Progress} from '@chakra-ui/react'
import dynamic from 'next/dynamic';
import { ContentSidebar } from '../../components/ContentSidebar';
import {Header} from '../../components/Header'
import { Sidebar } from '../../components/Sidebar'
import { withSSRAuth } from '../../utils/withSSRAuth';

type Project = {
  title: string,
  status: string,
  previsto: number,
  realizado: number,
  prazo: string,
  situacao: string,
}

const projects:Project[] = [
  {"title":"29295 - RECAPACITAÇÃO DO ALIMENTADOR DA SE SENADOR GUIOMARD",
"status":"No prazo", "previsto":20, "realizado":20, "prazo":"20/06/2021", "situacao": "Em andamento"},
  {"title":"29325-29332 - CONST SED E LDAT 69KV PEIXES-ACRELÂNDIA CCC",
"status":"Atrasado", "previsto":60, "realizado":20, "prazo":"20/06/2021", "situacao": "Em andamento"},
  {"title":"31041 - INSTALAÇÃO DE BC 3,6 MVAR NO SETOR 13,8 KV SE EPITACIOLÂNDIA",
"status":"No prazo", "previsto":0, "realizado":0, "prazo":"20/06/2021", "situacao": "Não iniciado"},
  {"title":"31075-31094 - CONST SED E LDAT 69KV RIO BRANCO-FLORESTA CCC",
"status":"Atrasado", "previsto":0, "realizado":0, "prazo":"20/06/2021", "situacao": "Não iniciado"},
  {"title":"31161 - REMANEJAMENTO DE LDAT COM RISCO DE QUEDA E DESVIO DE ÁREA DE INVASÃO",
"status":"No prazo", "previsto":20, "realizado":20, "prazo":"20/06/2021", "situacao": "Em andamento"},
  {"title":"31163-31165-39083 - CONST LDAT 69Kv SE MÂNCIO LIMA - SE JURUÁ CCC",
"status":"Atrasado", "previsto":30, "realizado":20, "prazo":"20/06/2021", "situacao": "Em andamento"},
  {"title":"31568-31574-31571 - CONST LDAT 69 kV TANGARÁ-ALTO ALEGRE E ADEQUAÇÃO DAS SE‘S CCC",
"status":"Atrasado", "previsto":23, "realizado":20, "prazo":"20/06/2021", "situacao": "Em andamento"},
  {"title":"38722 - REFORMA-DESLOCAMENTO TORRES 91 E 93 LDAT 69KV RIO BRANCO-TANGARÁ",
"status":"No prazo", "previsto":20, "realizado":20, "prazo":"20/06/2021", "situacao": "Em andamento"},
  {"title":"39009-39066 - CONST LDAT 69KV TARAUACÁ-FEIJÓ-ENVIRA, SE TARAUACÁ E SE ENVIRA CCC",
"status":"No prazo", "previsto":20, "realizado":20, "prazo":"20/06/2021", "situacao": "Em andamento"},
  {"title":"39182 - BAY DE CONEXÃO SE MOVÉL",
"status":"No prazo", "previsto":20, "realizado":20, "prazo":"20/06/2021", "situacao": "Em andamento"},
]

export default function Dashboard() {
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
                <Tag  colorScheme={'green'}>No prazo</Tag>
                <Tag  colorScheme={'red'}>Atrasado</Tag>
                <Tag fontSize="small" fontWeight="bold">Não iniciado</Tag>
                <Tag fontSize="small" fontWeight="bold">Em andamento</Tag>
                <Tag fontSize="small" fontWeight="bold">Atrasado</Tag>
              </HStack>
            </Box>
        <SimpleGrid mb="4" flex="1" gap="4" minChildWidth="256px" align="flex-start">
          {projects?.map(item=>(
            <Box
              p={["6"]}
              bg="gray.800"
              borderRadius={8}
              pb="4"
              key={Math.random().toString(36).substring(7)}
            >
              <HStack mb="2" justify="space-between">
                <Tag  colorScheme={item?.status==='Atrasado' ? "red" : "green"}>{item.status}</Tag>
                <Tag fontSize="small" fontWeight="bold">{item.situacao}</Tag>
              </HStack>
              <Stack spacing="0" mb="2">
                <Text fontSize="x-small" fontWeight="bold" color="gray.400">Nome do Projeto</Text>
                <Text fontSize="small">{item.title}</Text>
              </Stack>
              <HStack justifyContent="space-between" mb="2">
                <Stack spacing="0">
                  <Text fontSize="x-small" fontWeight="bold" color="gray.400">Prev. de Início</Text>
                  <Text fontSize="medium">{item.prazo}</Text>
                </Stack>
                <Stack spacing="0">
                  <Text fontSize="x-small" fontWeight="bold" color="gray.400">Prev. de Conclusão</Text>
                  <Text fontSize="medium">{item.prazo}</Text>
                </Stack>
              </HStack>
              <HStack justifyContent="space-between">
                <Stack spacing="0">
                  <Text fontSize="x-small" fontWeight="bold" color="gray.400">Avanço Previsto</Text>
                  <Text fontSize="medium">{item.previsto}%</Text>
                </Stack>
                <Stack spacing="0">
                  <Text fontSize="x-small" fontWeight="bold" color="gray.400">Avanço Real</Text>
                  <Text fontSize="medium">{item.realizado}%</Text>
                </Stack>
              </HStack>
            </Box>

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