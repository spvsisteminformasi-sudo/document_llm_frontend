import { UserType } from './user';
import { ChatHistoryType } from './chat-history';

export interface ChatSessionType {
    id?: number;
    name?: string;
    user_id?: number;
    created_at?: string;
    user?: UserType;
    chat_histories?: ChatHistoryType[];
}
