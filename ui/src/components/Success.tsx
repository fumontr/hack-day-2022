import { Flex } from '@chakra-ui/react'
import SuccessImage from '../assets/success.png'

export const Success = () => {
  return (
    // 固定値なので必要なサイズでリサイズする必要あるかも
    <Flex w="400px" h="130px" backgroundImage={SuccessImage} backgroundSize="100%"/>
  )
}