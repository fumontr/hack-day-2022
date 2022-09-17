import { Flex, Stack } from "@chakra-ui/react";
import FailedImage from '../assets/failed.png'
import LoserImage from '../assets/loser.png'

export const Failed = () => {
  return (
    // 固定値なので必要なサイズでリサイズする必要あるかも
    <Stack w="full" h="full" justifyContent="center">
      <Flex justifyContent="right">
        <Flex h="100px" w="100px" backgroundImage={LoserImage} backgroundSize="100%" />
      </Flex>
      <Flex justifyContent="right">
        <Flex h="100px" w="400px" backgroundImage={FailedImage} backgroundSize="100%"/>
      </Flex>
    </Stack>
  )
}