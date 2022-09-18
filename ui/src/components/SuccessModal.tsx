import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Mode } from "../App";
import SuccessImage from "../assets/success.png";

type SuccessModalProp = {
  successOpen: boolean;
  onSuccessClose: () => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
};

export const SuccessModal: React.FC<SuccessModalProp> = ({
  successOpen,
  onSuccessClose,
  setMode,
  mode,
}) => {
  const handleGoPending = () => {
    const navigate = useNavigate();
    if (mode === "AloneSuccess") {
      setMode("AlonePending");
    } else if (mode === "TogetherSuccess") {
      setMode("TogetherPending");
    } else {
      console.error("ありえないステート");
    }
    navigate("/play");
  };

  return (
    <Modal isOpen={successOpen} onClose={onSuccessClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody justifyContent="center">
          <Flex
            w="400px"
            h="130px"
            backgroundImage={SuccessImage}
            backgroundSize="100%"
          />
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button colorScheme="blue" mr={3} onClick={handleGoPending}>
            もう一度遊ぶ！
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    // 固定値なので必要なサイズでリサイズする必要あるかも
  );
};
