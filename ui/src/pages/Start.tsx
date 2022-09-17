import React, { useState } from "react";
import { PlayDescriptionMordal } from "../components/PlayDescriptionMordal"
import { RoomCreateMordal } from "../components/RoomCreateMordal"

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
     <div className="flex p-20 h-screen bg-white">
      <div className="flex-1">プレイ画像サンプル領域</div>
      <ul className="flex-1 flex flex-col justify-between py-20">
        <li className="text-3xl p-8 text-center">
          <button onClick={onClickPlayDescription} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">あそびかた</button>
        </li>
        <li className="text-3xl p-8 text-center">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">ひとりであそぶ</button>
        </li>
        <li className="text-3xl p-8 text-center">
          <button onClick={onClickRoomCreate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">みんなであそぶ</button>
        </li>
      </ul>
    </div>
    </>
  )
};
