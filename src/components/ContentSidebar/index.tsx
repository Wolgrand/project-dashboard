import { Box, Drawer, DrawerOverlay, DrawerContent,DrawerBody, DrawerCloseButton, DrawerHeader, useBreakpointValue } from "@chakra-ui/react";
import { useSidebarDrawer } from "../../contexts/SidebarDrawerContext";
import SidebarNav from "./SidebarNav";

export function ContentSidebar() {
  
  return (
    <Box as="aside" w="56" mr="8">
      <SidebarNav />
    </Box>
  )
}