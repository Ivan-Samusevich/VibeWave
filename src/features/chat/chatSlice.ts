import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../../types/api';

interface ChatState {
  messages: Message[];
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
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
  },
});

export const { addMessage, setMessages, setConnected } = chatSlice.actions;
export default chatSlice.reducer;
