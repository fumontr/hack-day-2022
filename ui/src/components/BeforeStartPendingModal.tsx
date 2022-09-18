import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import { Mode } from "../App";

type BeforeStartPendingModalProps = {
  pendingOpen: boolean;
  onClosePending: () => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  setParent: (is: boolean) => void;
};

export const BeforeStartPendingModal: React.FC<
  BeforeStartPendingModalProps
> = ({ pendingOpen, onClosePending, setMode, mode, setParent }) => {
  const handleStart = () => {
    // setMode to alone or together
    // set this to parent
    if (mode === "TogetherPending") {
      setParent(true);
      setMode("Together");
    }
    if (mode === "AlonePending") {
      setMode("Alone");
    }
    // close modal
    onClosePending();
  };

  return (
    <Modal
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isCentered
      size={"xl"}
      isOpen={pendingOpen}
      onClose={onClosePending}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>準備OK？</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <big>ゲームを開始できます</big>&nbsp;&nbsp; <Spinner />
          </p>
        </ModalBody>
        <ModalFooter>
          <Button type="button" colorScheme="blue" mr={3} onClick={handleStart}>
            始める！
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};