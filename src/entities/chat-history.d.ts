import { List } from 'postcss/lib/list';
import { ListRequest } from '@/hooks/useAxios';

export interface MetadataType {
    id: number
    document_id: number
    page_number: number
    source: string
    title: string
}

export interface SourceType {
    content?: string
    metadata?: MetadataType
}

export interface ChatHistoryType {
    id?: number;
    user_id?: number;
    chat_session_id?: number;
    query?: string;
    answer?: string;
    sources?: SourceType[]; // JSON type
    created_at?: string;
    user?: UserType;
    is_streaming?: boolean;
}

export interface ListChatHistoryRequest extends ListRequest {
    chat_session_id: number;
}
