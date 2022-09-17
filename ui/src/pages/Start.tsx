import React, { useState } from "react";
import { RoomCreateModal } from "../components/RoomCreateModal";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { Flex, HStack, Text, Stack } from "@chakra-ui/react";
import BackgroundImage from "../assets/background.png";
import { Mode } from "../App";
import { useNavigate } from "react-router-dom";
import { PlayDescriptionModal } from "../components/PlayDescriptionModal";

export const Start: React.FC<{
  setMyId: React.Dispatch<React.SetStateAction<string | null>>;
  setRoomId: React.Dispatch<React.SetStateAction<string | null>>;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
}> = ({ setMyId, setRoomId, setMode }) => {
  const {
    isOpen: howToOpen,
    onOpen: onHowToOpen,
    onClose: onHowToClose,
  } = useDisclosure();
  const {
    isOpen: enterRoomOpen,
    onOpen: onEnterRoomOpen,
    onClose: onEnterRoomClose,
  } = useDisclosure();

  const onClickPlayDescription = () => {
    onHowToOpen()
  };

  const onClickRoomCreate = () => {
    onEnterRoomOpen();
  };

  const navigate = useNavigate();

  const handlePlayAlone = () => {
    setMode("Alone");
    navigate("/play");
  };

  return (
    <>
      <PlayDescriptionModal howToOpen={howToOpen} onHowToClose={onHowToClose} />
      <RoomCreateModal
        enterRoomOpen={enterRoomOpen}
        onEnterRoomClose={onEnterRoomClose}
        setRoomId={setRoomId}
        setMyId={setMyId}
        setMode={setMode}
      />
      <Flex
        className="flex p-20 h-screen bg-white"
        backgroundImage={BackgroundImage}
        backgroundPosition="center"
        backgroundSize="70%"
      >
        <Stack w="full">
          <Flex justifyContent="right">
            <Text
              style={{ transform: "rotate(0.1)" }}
              fontSize="40px"
              fontWeight="bold"
              color="#86E2FF"
              borderBottom="4px"
            >
              シーソーオンライン！！！
            </Text>
          </Flex>
          <HStack w="full" h="full">
            <Button
              h="400px"
              className="bg-gray-300 hover:bg-blue-700 text-black-900 font-bold py-2 px-4 rounded w-full"
              opacity="0.9"
              onClick={handlePlayAlone}
            >
              <Text fontSize="4xl">ひとりであそぶ</Text>
            </Button>
            <Button
              h="400px"
              onClick={onClickRoomCreate}
              className="bg-gray-300 hover:bg-blue-700 text-black-900 font-bold py-2 px-4 rounded w-full"
              opacity="0.9"
            >
              <Text fontSize="4xl">みんなであそぶ</Text>
            </Button>
          </HStack>
          <Flex justifyContent="right">
            <Button
              w="80px"
              h="80px"
              justifyContent="center"
              borderRadius="40px"
              onClick={onClickPlayDescription}
            >
              <Text fontSize="2xl">?</Text>
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </>
  );
};
