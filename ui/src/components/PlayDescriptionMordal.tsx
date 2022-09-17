export const PlayDescriptionMordal = (props) => {
  const close = () => {
    props.setDialogDisplayState(false)
    props.setShowPlayDescription(false)
  }
    return (
    <div className="overflow-y-auto overflow-x-hidden fixed z-50 p-16 h-full w-full top-0 right-0 left-0 drop-shadow-2xl">
      <div className="bg-white h-full p-20">
        <div className="p-6 space-y-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">「ひとりであそぶ」</p>
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">「ふたりであそぶ」</p>
        </div>
        <div className="flex justify-between">
          <button onClick={close} className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-32">とじる</button>
        </div>
      </div>
    </div>
    );
}