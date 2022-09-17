import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  UnorderedList,
  ListItem,
  Text,
  Flex
} from "@chakra-ui/react";

type PlayDescriptionModalProps = {
  howToOpen: boolean;
  onHowToClose: () => void;
};

export const PlayDescriptionModal: React.FC<PlayDescriptionModalProps> = ({
  howToOpen,
  onHowToClose,
}) => {
  return (
    <Modal isOpen={howToOpen} onClose={onHowToClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader justifyContent="center">
          <Flex justifyContent="center">
            あそびかた？
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="xl" fontWeight="bold">あそびかた</Text>
          <OrderedList>
            <ListItem>ビデオカメラをONにしてください。</ListItem>
            <ListItem>あなたがうごいたほうこうにシーソーもうごきます。</ListItem>
            <ListItem>あなたがうごいたほうこうにシーソーもうごきます。</ListItem>
          </OrderedList>
          <Text fontSize="xl" fontWeight="bold" pt="8px">クリアするには？</Text>
          <UnorderedList>
            <ListItem>
              <Text fontWeight="bold">
                ひとりであそぶ。
              </Text>
            </ListItem>
            <Text>
              ゲームがスタートすると、ひだりうえからボールがでます。ボールをゴールにいれるとクリアです。
            </Text>
            <ListItem>
              <Text fontWeight="bold">
                みんなであそぶとは？
              </Text>
            </ListItem>
            <Text>
              ふたりできょうりょくしてゴールまでボールをはこんでください。
            </Text>
          </UnorderedList>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button colorScheme="blue" mr={3} onClick={onHowToClose}>
            さっそくあそぶ！
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
