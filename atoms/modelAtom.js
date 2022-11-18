import { atom } from "recoil";

export const modalState = atom({
  key: "modalState",
  // don't always want the modal open
  default:false
});

