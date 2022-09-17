import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useRef } from "react";
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

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };
  const inputRef = useRef<HTMLInputElement>();
  const close = async () => {
    await fetch(
      "https://backend-dot-hack-day-2022-362804.de.r.appspot.com/rooms/" +
        inputRef.current.value.toString() +
        "/join",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("=====");
        console.log(data);
        setMyId(data.user.id);
        // if (data.users[0].id == data.user.id) {
        //   setFriendId(data.users[1].id);
        // } else {
        //   setFriendId(data.users[0].id);
        // }
        setRoomId(data.password);
        navigate(`/play`);
      })
      .catch((err) => console.log(err));
  };
  return (
    <Modal size={"2xl"} isOpen={enterRoomOpen} onClose={onEnterRoomClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>あそびかた？</ModalHeader>
        <ModalCloseButton />
        <ModalBody>ああ</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onEnterRoomClose}>
            Close
          </Button>
          {/* <Button variant="ghost">Secondary Action</Button> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
    // <div className="overflow-y-auto overflow-x-hidden fixed z-50 p-16 h-full w-full top-0 right-0 left-0 drop-shadow-2xl">
    //   <div className=" bg-white h-full p-20">
    //     <div>
    //       <p className="text-base leading-relaxed text-gray-900 font-bold">
    //         ともだちとおなじ「あいことば」をきめてね！
    //       </p>
    //     </div>
    //     <input
    //       className="border-solid border-2 w-full mt-4 border-gray-500"
    //       type="text"
    //       ref={inputRef}
    //       placeholder=""
    //     />
    //     <div className="flex justify-between">
    //       <button
    //         type="submit"
    //         onClick={close}
    //         className="my-8 flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
    //       >
    //         さんか
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
};
