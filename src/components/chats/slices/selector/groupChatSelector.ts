// import { createSelector } from "@reduxjs/toolkit";
// import { RootState } from "../../../../store/rootreducer";
// import { groupChats } from "../types/groupMessagesTypes";

// const selectEncryptedMessages = (state: RootState) =>
//   state.getGroupChatState.groupChats;


// // memoized the selector only to decrypt the messages only when changes
// export const SelectDecryptedMessages = createSelector(
//   [selectEncryptedMessages], // input selector
//   (encryptedMessages) => {
//     console.log("encrypting messages.....");
//     return encryptedMessages.map((date: groupChats) =>
//       date.messages.map((msg) => ({
//         ...msg,
//         /// decrypte the message content here using decryption method
//       }))
//     );
//   }
// );

