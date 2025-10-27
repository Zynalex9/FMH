import React, { Dispatch, SetStateAction } from "react";
interface IProps {
  isAdmin: boolean;
  tabState: string;
  setTabState: Dispatch<SetStateAction<string>>;
}
export const RequestTabSwitch = ({
  isAdmin,
  tabState,
  setTabState,
}: IProps) => {
  return (
    <div className="border-b border-[px] border-b-gray-400">
      <h1 onClick={() => setTabState("all-requests")} className="cursor-pointer">All Requests</h1>
      <h1 onClick={() => setTabState("quick-entry")} className="cursor-pointer">Quick Entry</h1>
    </div>
  );
};
