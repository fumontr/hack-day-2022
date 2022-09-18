import React from "react";
import {
  Button,
  Flex, ListItem, Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  Text, UnorderedList
} from "@chakra-ui/react";
import {Success} from "./Success";

type ResultModalProperties = {
  result: string
  resultOpen: boolean
  onResultClose: () => void
}
export const ResultModal: React.FC<ResultModalProperties> = ({
  result,
  resultOpen,
  onResultClose
}) => {
  if (result == "Success") {

  }
  return (
    <Modal isOpen={resultOpen} onClose={onResultClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody justifyContent="center">
          <Success />
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button colorScheme="blue" mr={3} onClick={onResultClose}>
            もう一度遊ぶ！
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}