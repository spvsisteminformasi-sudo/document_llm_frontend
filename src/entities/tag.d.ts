import { DocumentType } from './document';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

export interface TagType extends TreeViewBaseItem {
    id?: number | string;
    name?: string;
    parent_id?: number | null;
    item_id?: number | null;
    parent?: TagType | null;
    tag_type?: string;
    document_id?: number;
    document?: DocumentType;
    document_content_id?: number;
    page_number?: number;
    created_at?: string;
    updated_at?: string;
    children?: Tag[];
    document?: DocumentType;
}
