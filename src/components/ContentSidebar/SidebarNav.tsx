import { Button, Stack, Icon, Text } from "@chakra-ui/react";
import { useState } from "react";
import { RiArrowLeftRightFill, RiContactsLine, RiDashboardLine, RiGitMergeLine, RiInputMethodLine } from "react-icons/ri";
import NavLink from "./NavLink";
import NavSection from "./NavSection";

export default function SidebarNav(){
  const [displayProject, setDisplayProject] = useState(false)

  function handleDisplayProject() {
    setDisplayProject(!displayProject)
  }

  return(
    <Stack spacing="6" align="flex-start">
      
      
        <NavSection title="ETAPAS">
          <Text flex="1" border="1px" borderColor="pink.500" rounded="md" p="2">Elaboração de Projeto</Text>
          <Text flex="1" border="1px" borderColor="gray.900" rounded="md" p="2">Aquisição de Terreno</Text>
          <Text flex="1" border="1px" borderColor="gray.900" rounded="md" p="2" >Licenciamento Ambiental</Text>
          <Text flex="1" border="1px" borderColor="gray.900" rounded="md" p="2">Licenciamento Fundiário</Text>
          <Text flex="1" border="1px" borderColor="gray.900" rounded="md" p="2">Aquisição de Materiais</Text>
          <Text flex="1" border="1px" borderColor="gray.900" rounded="md" p="2">Execução</Text>
        </NavSection>
    
      
    </Stack>
  )
}