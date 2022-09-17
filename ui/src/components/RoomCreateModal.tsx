import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type RoomCreateModalProps = {
  enterRoomOpen: boolean;
  onEnterRoomOpen: () => void;
  onEnterRoomClose: () => void;
  setRoomId: (roomId: string) => void;
  setMyId: (myId: string) => void;
};

export const RoomCreateModal: React.FC<RoomCreateModalProps> = ({
  enterRoomOpen,
  onEnterRoomOpen,
  onEnterRoomClose,
  setRoomId,
  setMyId,
}) => {
  let navigate = useNavigate();
  const [val, setVal] = useState("");

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };
  const inputRef = useRef<HTMLInputElement>();
  const close = async () => {
    return fetch(
      `https://backend-dot-hack-day-2022-362804.de.r.appspot.com/rooms/${val}/join`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("=====");
        console.log(data);
        setMyId(data.user.id);
        setRoomId(data.password);
        navigate(`/play`);
      })
      .catch((err) => alert(`couldn't fetch room info. ${err}`));
  };
  return (
    <Modal size={"2xl"} isOpen={enterRoomOpen} onClose={onEnterRoomClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>ひらがな３文字の あいことば を入力</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input size={"lg"} placeholder="あいことば" />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={close}>
            進む
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
