// React Imports
import { useState, useEffect } from 'react'
import type { MouseEvent } from 'react'

// MUI Imports
import { Box, Typography, Button } from '@mui/material' // F_MODIFIED: Tambahkan Typography & Button

// Component Imports
import MailContentSearch from './MailContentSearch'
import MailContentList from './MailContentList'
import DocumentDetails from './DocumentDetails';

import type { TagType } from '@/entities/tag'

type Props = {
	documents: TagType[];
	isLoading: boolean;
	selectedTag: TagType | null;
	onTagSelected: (tag: TagType) => void; // F_ADDED
	setSidebarOpen: (value: boolean) => void;
	isBelowLgScreen: boolean;
	isBelowMdScreen: boolean;
	isBelowSmScreen: boolean;
	setBackdropOpen: (value: boolean) => void;
	onRefresh: () => void;
}

const MailContent = (props: Props) => {
	// Props
	const {
		documents, 
		isLoading, 
		selectedTag,
		onTagSelected,
		setSidebarOpen,
		isBelowLgScreen,
		isBelowMdScreen,
		isBelowSmScreen,
		setBackdropOpen,
		onRefresh,
	} = props

	const [docForDetail, setDocForDetail] = useState<TagType | null>(null);
	const [searchTerm, setSearchTerm] = useState('')
	const [drawerOpen, setDrawerOpen] = useState(false);
	// const showDetails = selectedTag && selectedTag.tag_type === 'file' && documents.length === 1 && documents[0].id === selectedTag.id;

	const handleOpenDetails = (doc: TagType) => {
		setDocForDetail(doc);
		setDrawerOpen(true);
	};

	useEffect(() => {
		setDrawerOpen(false);
		setDocForDetail(null);
	}, [selectedTag]);

	return (
		<div 
			className='flex flex-col items-center justify-center is-full bs-full relative overflow-hidden bg-backgroundPaper'
			style={{ flexGrow: 1, width: '100%', height: '100%' }}
  		>
			<MailContentSearch
				isBelowScreen={isBelowMdScreen}
				searchTerm={searchTerm}
				setSidebarOpen={setSidebarOpen}
				setBackdropOpen={setBackdropOpen}
				setSearchTerm={setSearchTerm}
				onRefresh={onRefresh}
			/>
			<MailContentList
				isLoading={isLoading}
				documents={documents}
				searchTerm={searchTerm}
				onItemSelected={handleOpenDetails} // Gunakan handler baru
				selectedTag={docForDetail}
			/>

			<DocumentDetails
				drawerOpen={drawerOpen}
				setDrawerOpen={setDrawerOpen}
				selectedDoc={docForDetail} // Teruskan tag yang dipilih
			/>
		</div>
	)
}

export default MailContent
