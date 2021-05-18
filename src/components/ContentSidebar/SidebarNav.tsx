import { Button, Stack, Icon, Text } from "@chakra-ui/react";
import { useState } from "react";
import Link from 'next/link'
import { RiArrowLeftRightFill, RiContactsLine, RiDashboardLine, RiGitMergeLine, RiInputMethodLine } from "react-icons/ri";
import NavLink from "./NavLink";
import NavSection from "./NavSection";
import { useRouter } from 'next/router'

export default function SidebarNav(){
  const router = useRouter()

  const page = router.pathname


  return(
    <Stack spacing="6" align="flex-start">
      <NavSection title="PROJETOS">
        <Link href="/dashboard">
          <a>
            <Text flex="1"  color={page === '/dashboard' ? 'pink.500' : null}>Todos os projetos</Text>
          </a>
        </Link>
      </NavSection>
      <NavSection title="ETAPAS">
        <Link href="/dashboard/etapa/projeto">
          <a>
            <Text flex="1" color={page === '/dashboard/etapa/projeto' ? 'pink.500' : null} >Elaboração de Projeto</Text>
          </a>
        </Link>
        <Link href="/dashboard/etapa/terreno">
          <a>
            <Text flex="1" color={page === '/dashboard/etapa/terreno' ? 'pink.500' : null} >Aquisição de Terreno</Text>
          </a>
        </Link>
        <Link href="/dashboard/etapa/ambiental">
          <a>
            <Text flex="1" color={page === '/dashboard/etapa/ambiental' ? 'pink.500' : null}  >Licenciamento Ambiental</Text>
          </a>
        </Link>
        <Link href="/dashboard/etapa/fundiario">
          <a>
            <Text flex="1" color={page === '/dashboard/etapa/fundiario' ? 'pink.500' : null} >Licenciamento Fundiário</Text>
          </a>
        </Link>
        <Link href="/dashboard/etapa/materiais">
          <a>
            <Text flex="1" color={page === '/dashboard/etapa/materiais' ? 'pink.500' : null} >Aquisição de Materiais</Text>
          </a>
        </Link>
        <Link href="/dashboard/etapa/execucao">
          <a>
            <Text flex="1" color={page === '/dashboard/etapa/execucao' ? 'pink.500' : null} >Execução</Text>
          </a>
        </Link>
      </NavSection>
    </Stack>
  )
}