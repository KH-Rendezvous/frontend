import React from "react";

const ProfileListItem = ({ item, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex justify-between items-center py-3 border-b border-gray-100 transition-colors ${
        item.readOnly ? "cursor-default" : "cursor-pointer hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-2">
        {/* 아이콘이 있고, noIcon 옵션이 없을 때만 출력 */}
        {!item.noIcon && <span className="text-base">{item.icon}</span>}

        <span
          className={`text-sm font-bold ${
            item.isPlaceholder ? "text-gray-500" : "text-gray-800"
          }`}
        >
          {item.label}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {/* 값이 있을 때만 출력 */}
        {item.value && (
          <span className="text-sm font-medium text-gray-800">
            {item.value}
          </span>
        )}
        {/* 수정 가능할 때만 화살표 출력 */}
        {!item.readOnly && (
          <span className="text-gray-400 text-sm ml-1">{">"}</span>
        )}
      </div>
    </div>
  );
};

export default ProfileListItem;
