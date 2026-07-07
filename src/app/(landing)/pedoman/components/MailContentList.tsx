// React Imports
import type { Dispatch, MouseEvent, ReactNode, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

// MUI Imports
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
// import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Backdrop from '@mui/material/Backdrop'
import Chip from '@mui/material/Chip' // F_ADDED: Pastikan Chip diimpor
import Box from '@mui/material/Box' // F_ADDED: Pastikan Box diimpor

// Third-party Imports
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Styles Imports
import styles from './styles.module.css'

// Data Imports
// import { labelColors } from './SidebarLeft'

import type { TagType } from '@/entities/tag'

type Props = {
	isLoading: boolean;
	documents: TagType[];
	searchTerm: string;
	onItemSelected: (tag: TagType) => void;
	selectedTag: TagType | null;
}

const MailContentList = (props: Props) => {
	// Props
	const {
		isLoading,
		documents,
		searchTerm,
		onItemSelected,
		selectedTag
	} = props

	// State for filtering documents based on search term
	const [filteredDocuments, setFilteredDocuments] = useState<TagType[]>(documents); // F_UPDATED: Menggunakan TagType

	useEffect(() => {
		if (searchTerm) {
			setFilteredDocuments(documents.filter(doc =>
				doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(doc.document?.title && doc.document.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
				(doc.document?.initiator && doc.document.initiator.toLowerCase().includes(searchTerm.toLowerCase()))
			));
		} else {
			setFilteredDocuments(documents);
		}
	}, [searchTerm, documents]);

	const documentToDisplay = filteredDocuments;

	// Tampilan saat loading
	if (isLoading) {
		return (
			<div className='flex items-center justify-center gap-2 grow is-full'>
				<CircularProgress />
				<Typography>Loading Documents...</Typography>
			</div>
		)
	}
	return (
		<div className='relative overflow-hidden grow is-full'>
			{/* Menggunakan PerfectScrollbar untuk scrolling yang mulus */}
			<PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }} className='bs-full'>
				<div className='flex flex-col'>
					{documentToDisplay.length === 0 ? (
						// Tampilan ketika tidak ada dokumen
						<div className='flex flex-col items-center justify-center bs-full gap-4 text-center p-5'>
							<i className='ri-file-search-line text-7xl text-disabled' />
							<Typography variant='h6'>
								{searchTerm ? 'Tidak ada dokumen yang cocok' : 'Tidak ada dokumen di folder ini'}
							</Typography>
						</div>
					) : (
						// Mapping dan menampilkan setiap dokumen
						documentToDisplay.map(doc => (
							<div
								key={doc.id}
								onClick={() => onItemSelected(doc)}
								className={classnames(
									// Menambahkan class 'document-item' untuk styling hover
									'document-item flex justify-between items-center gap-4 p-4 cursor-pointer border-b',
									styles.emailList,
									{
										// Menambahkan background untuk item yang sedang aktif/dipilih
										'bg-actionSelected': selectedTag?.id === doc.id
									}
								)}
							>
								{/* Bagian Kiri: Ikon dan Informasi Dokumen */}
								<div className='flex items-center gap-4 overflow-hidden'>
									<CustomAvatar skin='light' color={'info'} size={38}>
										<i className='ri-file-text-line text-2xl' />
									</CustomAvatar>
									<div className='flex flex-col overflow-hidden'>
										<div className='flex items-center gap-2'>
											<Typography color='text.primary' className='font-small' noWrap>
												{doc.document?.title || doc.name}
											</Typography>
										</div>
										<Typography variant='body2' color='text.secondary' noWrap>
											{doc.document?.document_type || ''}
											{/* {doc.document?.initiator || ''} */}
										</Typography>
										{/* <Typography variant='body2' color='text.secondary' noWrap>
											{doc.document?.document_type && (
												<Chip label={doc.document.document_type} color='primary' size='small' />
											)}
										</Typography> */}
									</div>
								</div>

								{/* Bagian Kanan: Tanggal dan Aksi (Download) */}
								<div className='flex items-center gap-3'>
									<Typography variant='body2' color='text.disabled'
										className={classnames('whitespace-nowrap hidden sm:block', styles.emailInfo)}
									>
										{doc.document?.date_of_determination
											? new Date(doc.document.date_of_determination).toLocaleDateString('id-ID', {
												year: 'numeric',
												month: 'short',
												day: 'numeric'
											})
											: 'N/A'}
									</Typography>

									{/* Wrapper untuk aksi yang muncul saat hover */}
									<div className={styles.emailActions}>
										<Tooltip title='Download' placement='top'>
											<IconButton
												// href={doc.document?.url}
        										// download={doc.document?.title || 'dokumen.pdf'}
												// disabled={!doc.document?.url}
												onClick={e => {
													e.stopPropagation(); // Mencegah trigger onClick pada parent
													if (doc.document?.url) {
														// window.open(doc.document.url, 'download');
														const link = document.createElement('a');
														link.href = doc.document.url;
														link.setAttribute('download', doc.document.title || 'dokumen.pdf');
														document.body.appendChild(link);
														link.click();
														document.body.removeChild(link);
													}
												}}
											>
												<i className='ri-download-line text-textSecondary' />
											</IconButton>
										</Tooltip>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</PerfectScrollbar>
		</div>
	)

}

export default MailContentList
