import React, { useState } from "react";
import { PlayDescriptionMordal } from "../components/PlayDescriptionMordal"
import { RoomCreateMordal } from "../components/RoomCreateMordal"

import { Flex, HStack, Button, Text, Stack } from '@chakra-ui/react'
import BackgroundImage from '../assets/background.png'

export const Start = ({setMyId, setFriendId, setRoomId}) => {
  const [dialogDisplayState, setDialogDisplayState] = useState(false)
  const [showPlayDescription, setShowPlayDescription] = useState(false)
  const [roomCreateMordalDisplayState, setRoomCreateMordalDisplayState] = useState(false)

  const onClickPlayDescription = () => {
    setShowPlayDescription(true)
    setDialogDisplayState(true)
  }

  const onClickRoomCreate = () => {
    setRoomCreateMordalDisplayState(true)
    setDialogDisplayState(true)
  }

return (
    <>
      {showPlayDescription && <PlayDescriptionMordal setDialogDisplayState = {setDialogDisplayState} setShowPlayDescription={setShowPlayDescription} />}
      {roomCreateMordalDisplayState && <RoomCreateMordal setRoomId={setRoomId} setFriendId = {setFriendId} setMyId={setMyId} setDialogDisplayState = {setDialogDisplayState} setRoomCreateMordalDisplayState={setRoomCreateMordalDisplayState}/> }
       <Flex className="flex p-20 h-screen bg-white" backgroundImage={BackgroundImage} backgroundPosition="center" backgroundSize="70%">
         <Stack w="full">
           <Flex justifyContent="right" transform="rotate(0.1)">
             <Text fontSize="40px" fontWeight="bold" color="#86E2FF" borderBottom="4px" background="white">シーソーオンライン</Text>
           </Flex>
          <HStack w="full" h="full">
            <Button h="400px" className="bg-gray-300 hover:bg-blue-700 text-black-900 font-bold py-2 px-4 rounded w-full" opacity="0.9">
              <Text fontSize="4xl">
                ひとりであそぶ
              </Text>
            </Button>
            <Button  h="400px" onClick={onClickRoomCreate} className="bg-gray-300 hover:bg-blue-700 text-black-900 font-bold py-2 px-4 rounded w-full" opacity="0.9">
              <Text fontSize="4xl">
                みんなであそぶ
              </Text>
            </Button>
          </HStack>
           <Flex justifyContent="right">
             <Button w="80px" h="80px" justifyContent="center" borderRadius="40px" onClick={onClickPlayDescription}>
               <Text fontSize="2xl">?</Text>
             </Button>
           </Flex>
         </Stack>
      </Flex>
    </>
  )
};
