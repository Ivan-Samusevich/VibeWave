import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MessageResponse } from '../../types/api';

interface ChatState {
  messages: MessageResponse[];
  isConnected: boolean;
}

const initialState: ChatState = {
  messages: [],
  isConnected: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<MessageResponse>) => {
      const exists = state.messages.some(m => m.messageId === action.payload.messageId);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
    setMessages: (state, action: PayloadAction<MessageResponse[]>) => {
      state.messages = action.payload;
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
  },
});

export const { addMessage, setMessages, setConnected } = chatSlice.actions;
export default chatSlice.reducer;
