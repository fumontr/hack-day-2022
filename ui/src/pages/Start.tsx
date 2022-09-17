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
import { Link, useNavigate } from "react-router-dom";
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
    onHowToOpen();
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
          <Flex justifyContent="right">
            {/* <Button
              w="80px"
              h="80px"
              justifyContent="center"
              borderRadius="40px"
              onClick={onClickPlayDescription}
            > */}
            <a href="https://github.com/furiko/hack-day-2022" target={"_blank"}>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#222"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
            </a>
            {/* </Button> */}
          </Flex>
        </Stack>
      </Flex>
    </>
  );
};
