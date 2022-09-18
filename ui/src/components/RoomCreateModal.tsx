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
import { Mode } from "../App";

type RoomCreateModalProps = {
  enterRoomOpen: boolean;
  onEnterRoomClose: () => void;
  setRoomId: (roomId: string) => void;
  setMyId: (myId: string) => void;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
};

export type RoomInfo = {
  id: string; // あああ とか
  user_count: number;
  password: string;
  status: "Waiting";
  users: string[];
  user: {
    id: string;
  };
};

export const RoomCreateModal: React.FC<RoomCreateModalProps> = ({
  enterRoomOpen,
  onEnterRoomClose,
  setRoomId,
  setMyId,
  setMode,
}) => {
  let navigate = useNavigate();
  const [val, setVal] = useState("");
  const [loading, setLoading] = useState(false);

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };

  const close = async () => {
    setLoading(true);

    if (val.length !== 3) return alert("あいことばは３文字で入力してね！");
    // hiragana regex
    if (!/^[\u3040-\u309F]+$/.test(val))
      return alert("あいことばは、ひらがなだよ！");

    try {
      const res = await fetch(
        `https://backend-dot-hack-day-2022-362804.de.r.appspot.com/rooms/${val}/join`,
        requestOptions
      );
      const data = (await res.json()) as RoomInfo;
      console.log(data);
      setMyId(data.user.id);
      setRoomId(data.id);
      setMode("TogetherPending");
      // @ts-ignore
      window.mode = "TogetherPending"
      navigate(`/play`);
    } catch (error) {
      alert(`couldn't fetch room info. ${error}`);
    }
  };
  return (
    <Modal
      isCentered
      closeOnEsc={false}
      closeOnOverlayClick={false}
      size={"2xl"}
      isOpen={enterRoomOpen}
      onClose={onEnterRoomClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>ひらがな３文字の あいことば を入力</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            value={val}
            size={"lg"}
            placeholder="あいことば"
            onChange={(e) => setVal(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={loading}
            isLoading={loading}
            type="button"
            colorScheme="blue"
            mr={3}
            onClick={close}
          >
            進む
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
