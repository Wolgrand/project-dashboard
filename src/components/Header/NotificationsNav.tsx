import {Icon, HStack, Tooltip} from '@chakra-ui/react'
import Link from 'next/link'
import { RiNotificationLine, RiFile3Line } from 'react-icons/ri'

export default function NotificationsNav() {
  return (
    <HStack
      spacing={["6", "8"]}
      mx={["6", "8"]}
      pr={["6", "8"]}
      py="1"
      color="gray.300"
      borderRightWidth={1}
      borderColor="gray.700"
    >
      <Icon as={RiNotificationLine} fontSize="20" />
      <Tooltip cursor="pointer" hasArrow label="Projetos" bg="gray.100" color="black" shouldWrapChildren>
        <Link  href="/projects">
          <Icon cursor="pointer" as={RiFile3Line} fontSize="20" />
        </Link>
      </Tooltip>
    </HStack>
  )
}