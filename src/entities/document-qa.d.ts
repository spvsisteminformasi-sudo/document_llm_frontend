
import { DocumentType } from './document';

export interface MetadataType {
    id: number
    document_content_id: number
    document_id: number
    page_number: number
    source: string
    title: string
    chapter: string
    title_page: string
    number: string
    year: string
    page_number: string
    clause: string
}

export interface SourceType {
    content: string;
    metadata: MetadataType;
}

export interface DocumentQaType {
    answer: string;
    sources: SourceType[];
}
