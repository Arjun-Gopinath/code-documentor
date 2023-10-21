import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faFile,
  faChevronRight,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";

const TreeNode = ({ data, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div className="flex items-center cursor-pointer">
        <div style={{ paddingLeft: level * 20 + "px" }}>
          {data && data.type === "blob" ? (
            <FontAwesomeIcon icon={faFile} className="mr-2" />
          ) : (
            data && data.type === "tree" ? (
              <FontAwesomeIcon icon={faFolder} className="mr-2" />
            ) : null
          )}
          <span>{data && data.path}</span>
        </div>
        {data && data.type === "tree" && (
          <FontAwesomeIcon
            icon={isExpanded ? faChevronDown : faChevronRight}
            onClick={handleToggle}
          />
        )}
      </div>
      {data && data.type === "tree" && isExpanded && data !== null && data !== undefined && (
        <div className="ml-4">
        {Object.keys(data).map((key) => {
            console.log(data[key], key, data[key].length, data[key].type);
            const childData = data[key];
            if (Array.isArray(childData) && key === "children") {
                return <TreeNode key={key} data={childData} level={level + 1} />;
            }
        })}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
