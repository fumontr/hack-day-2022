import React, { useState } from "react";
import { PlayDescriptionMordal } from "../components/PlayDescriptionMordal";
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

export const Start: React.FC<{
  setMyId: React.Dispatch<React.SetStateAction<string | null>>;
  setRoomId: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ setMyId, setRoomId }) => {
  const [dialogDisplayState, setDialogDisplayState] = useState(false);
  const [showPlayDescription, setShowPlayDescription] = useState(false);
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
    setShowPlayDescription(true);
    setDialogDisplayState(true);
  };

  const onClickRoomCreate = () => {
    onEnterRoomOpen();
    // setRoomCreateMordalDisplayState(true);
    // setDialogDisplayState(true);
  };

  return (
    <>
      <Modal isOpen={howToOpen} onClose={onHowToClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>遊びかた？</ModalHeader>
          <ModalCloseButton />
          <ModalBody>ああ</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onHowToClose}>
              Close
            </Button>
            {/* <Button variant="ghost">Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
      <RoomCreateModal
        enterRoomOpen={enterRoomOpen}
        onEnterRoomOpen={onEnterRoomOpen}
        onEnterRoomClose={onEnterRoomClose}
        setRoomId={setRoomId}
        setMyId={setMyId}
      />
      <div className="flex p-20 h-screen bg-white">
        <div className="flex-1">
          プレイ画像サンプル領域
          <button className="bg-gray-300 hover:bg-blue-700 text-black-900 font-bold py-2 px-4 rounded w-full">
            ひとりであそぶ
          </button>
          <button
            onClick={onClickRoomCreate}
            className="bg-gray-300 hover:bg-blue-700 text-black-900 font-bold py-2 px-4 rounded w-full"
          >
            みんなであそぶ
          </button>
          {/*<ul className="flex-1 flex flex-col justify-between py-20">*/}
          {/*<li className="text-3xl p-8 text-center">*/}
          {/*  <button onClick={onClickPlayDescription} className="bg-gray-300 hover:bg-blue-700 text-black-900 font-bold py-2 px-4 rounded w-full">あそびかた</button>*/}
          {/*</li>*/}
          {/*<li className="text-3xl p-8 text-center">*/}
          {/*  <button className="bg-gray-300 hover:bg-blue-700 text-black-900 font-bold py-2 px-4 rounded w-full">ひとりであそぶ</button>*/}
          {/*</li>*/}
          {/*<li className="text-3xl p-8 text-center">*/}
          {/*  <button onClick={onClickRoomCreate} className="bg-gray-300 hover:bg-blue-700 text-black-900 font-bold py-2 px-4 rounded w-full">みんなであそぶ</button>*/}
          {/*</li>*/}
          {/*</ul>*/}
        </div>
      </div>
    </>
  );
};
