
import { DataResponse, ListRequest, ListResponse, useAxios } from '@/hooks/useAxios'

export interface DocumentType {
    id: number;
    title: string;
    file_path: string;
    mime_type: string;
    file_size: number;
    user_id: number;
    file?: File;
    original_filename?: string;
    url?: string;
    document_type?: string;
    initiator?: string;
    number?: string;
    year?: number;
    about?: string;
    place_of_determination?: string;
    date_of_determination?: string;
    official?: string;
    view_count?: number;
    download_count?: number;
    is_published?: boolean;
    status?: string;
    category_document?: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface DocumentFilterType extends ListRequest {
    category_document: string;
}
