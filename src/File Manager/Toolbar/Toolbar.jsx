import { useEffect, useState } from "react";
import { BsCopy, BsFolderPlus, BsGridFill, BsScissors } from "react-icons/bs";
import { FiRefreshCw } from "react-icons/fi";
import { MdClear, MdOutlineDelete, MdOutlineFileUpload } from "react-icons/md";
import { BiRename } from "react-icons/bi";
import { FaRegPaste } from "react-icons/fa6";
import { createFolderTree } from "../../utils/createFolderTree";

const Toolbar = ({
  allowCreateFolder = true,
  allowUploadFile = true,
  handleRefreshFiles,
  isItemSelection,
  setIsItemSelection,
  currentPath,
  selectedFile,
  setSelectedFile,
  files,
  clipBoard,
  setClipBoard,
  handlePaste,
  triggerAction,
}) => {
  // Toolbar Items
  const [toolbarLeftItems, setToolbarLeftItems] = useState([
    {
      icon: <BsFolderPlus size={17} strokeWidth={0.3} />,
      text: "New Folder",
      permission: allowCreateFolder,
      onClick: () => triggerAction.show("createFolder"),
    },
    {
      icon: <MdOutlineFileUpload size={18} />,
      text: "Upload File",
      permission: allowUploadFile,
      onClick: () => triggerAction.show("uploadFile"),
    },
    {
      icon: <FaRegPaste size={18} />,
      text: "Paste",
      permission: false,
      onClick: () => {},
    },
  ]);

  const toolbarRightItems = [
    // {
    //   icon: <BsGridFill size={16} />,
    //   title: "View",
    //   onClick: handleViewChange,
    // },
    {
      icon: <FiRefreshCw size={16} />,
      title: "Refresh",
      onClick: handleRefreshFiles,
    },
  ];

  // Handle Pasting
  const handlePasting = (pastePath, clipBoard) => {
    const selectedCopiedFile = clipBoard.files[0];
    const copiedFiles = files.filter((f) => {
      const folderToCopy = f.path === selectedCopiedFile.path && f.name === selectedCopiedFile.name;
      const folderChildren = f.path.startsWith(
        selectedCopiedFile.path + "/" + selectedCopiedFile.name
      );
      return folderToCopy || folderChildren;
    });

    handlePaste(pastePath, clipBoard, copiedFiles);
    clipBoard.isMoving && setClipBoard(null);
    setIsItemSelection(false);
    setSelectedFile(null);
  };

  useEffect(() => {
    setToolbarLeftItems((prev) => {
      return prev.map((item) => {
        if (item.text === "Paste") {
          return {
            ...item,
            permission: !!clipBoard,
            onClick: () => handlePasting(currentPath, clipBoard),
          };
        } else {
          return item;
        }
      });
    });
  }, [clipBoard, currentPath]);

  // Handle Cut / Copy
  const handleCutCopy = (isMoving) => {
    setClipBoard({
      files: [{ ...createFolderTree(selectedFile, files) }],
      isMoving: isMoving,
    });
  };
  //

  // Selected File/Folder Actions
  if (isItemSelection) {
    const pastePath = selectedFile.path + "/" + selectedFile.name;

    return (
      <div className="toolbar file-selected">
        <div className="file-action-container">
          <div>
            <button className="item-action file-action" onClick={() => handleCutCopy(true)}>
              <BsScissors size={18} />
              <span>Cut</span>
            </button>
            <button className="item-action file-action" onClick={() => handleCutCopy(false)}>
              <BsCopy strokeWidth={0.1} size={17} />
              <span>Copy</span>
            </button>
            {selectedFile.isDirectory ? (
              <button
                className="item-action file-action"
                onClick={() => handlePasting(pastePath, clipBoard)}
                disabled={!clipBoard}
              >
                <FaRegPaste size={18} />
                <span>Paste</span>
              </button>
            ) : (
              <></>
            )}
            <button
              className="item-action file-action"
              onClick={() => triggerAction.show("rename")}
            >
              <BiRename size={19} />
              <span>Rename</span>
            </button>
            <button
              className="item-action file-action"
              onClick={() => triggerAction.show("delete")}
            >
              <MdOutlineDelete size={19} />
              <span>Delete</span>
            </button>
          </div>
          <button className="item-action file-action" onClick={() => setIsItemSelection(false)}>
            <MdClear size={18} />
            <span>Clear Selection</span>
          </button>
        </div>
      </div>
    );
  }
  //

  return (
    <div className="toolbar">
      <div className="fm-toolbar">
        <div>
          {toolbarLeftItems
            .filter((item) => item.permission)
            .map((item, index) => (
              <button className="item-action" key={index} onClick={item.onClick}>
                {item.icon}
                <span>{item.text}</span>
              </button>
            ))}
        </div>
        <div>
          {toolbarRightItems.map((item, index) => (
            <div key={index} className="toolbar-left-items">
              <div
                className="item-action icon-only"
                title={item.title}
                role="button"
                onClick={item.onClick}
              >
                {item.icon}
              </div>
              {index !== toolbarRightItems.length - 1 && <div className="item-separator"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
