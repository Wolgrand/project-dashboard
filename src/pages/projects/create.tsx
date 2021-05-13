import {Flex, Box, Heading, Divider, VStack, SimpleGrid, HStack, Button, Text} from '@chakra-ui/react'
import Link from 'next/link'
import { Input } from '../../components/Form/Input';
import {Header} from '../../components/Header'
import { Sidebar } from '../../components/Sidebar';

export default function CreateU(){
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

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input name="title" label="Nome do Projeto" />
              <Input name="data-inicio" label="Data de Início" type="date" />
              <Input name="data-conclusao" label="Data de Conclusão" type="date" />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Text>Aquisição de Terreno</Text>
              <Input name="data-inicio-aquisicao-terreno"type="date" />
              <Input name="data-conclusao-aquisicao-terreno"type="date" />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Text>Elaboração de Projeto</Text>
              <Input name="data-inicio-projeto" type="date" />
              <Input name="data-conclusao-projeto" type="date" />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Text >Aquisição de Materiais</Text>
              <Input name="data-inicio-aquisicao-materiais" type="date" />
              <Input name="data-conclusao-aquisicao-materiais" type="date" />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Text >Licenciamento Ambiental</Text>
              <Input name="data-inicio-licenciamento-ambiental" type="date" />
              <Input name="data-conclusao-licenciamento-ambiental" type="date" />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Text >Licenciamento Fundiário</Text>
              <Input name="data-inicio-licenciamento-Fundiário" type="date" />
              <Input name="data-conclusao-licenciamento-Fundiário" type="date" />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Text>Execução</Text>
              <Input name="data-inicio-execucao" type="date" />
              <Input name="data-conclusao-execucao" type="date" />
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link  href="/users" passHref>
                <Button as="a" colorScheme="whiteAlpha">Cancelar</Button>
              </Link>
              <Button colorScheme="pink">Salvar</Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}