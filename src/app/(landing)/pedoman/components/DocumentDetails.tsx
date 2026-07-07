// DocumentDetails.tsx

import type { ReactNode } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { styled, keyframes } from '@mui/material/styles'
import Grid from '@mui/material/Grid'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Types Imports
import type { TagType } from '@/entities/tag'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'

type Props = {
	drawerOpen: boolean
	setDrawerOpen: (value: boolean) => void
	selectedDoc: TagType | null
}

// Wrapper untuk scrollbar
const ScrollWrapper = ({ children }: { children: ReactNode }) => {
	return (
		<PerfectScrollbar options={{ wheelPropagation: false }}>
			{children}
		</PerfectScrollbar>
	)
}

// Styled component untuk drawer yang muncul dari kanan
const DetailsDrawer = styled('div')<{ drawerOpen: boolean }>(({ theme, drawerOpen }) => ({
	display: 'flex',
	flexDirection: 'column',
	blockSize: '100%',
	inlineSize: '100%',
	position: 'absolute',
	top: 0,
	right: drawerOpen ? 0 : '-100%',
	zIndex: 12, // Z-index lebih tinggi dari list
	overflow: 'hidden',
	backgroundColor: theme.palette.background.paper,
	transition: 'right 0.3s ease-in-out',
	boxShadow: theme.shadows[6],
}))

// Komponen kecil untuk menampilkan baris metadata
const MetadataRow = ({ label, value }: { label: string; value?: string | null }) => (
	<div className='flex justify-between items-center gap-4 flex-wrap'>
		<Typography color='text.secondary'>{label}</Typography>
		<Typography color='text.primary' className='font-medium text-right'>
			{value || '-'}
		</Typography>
	</div>
)

const DocumentDetails = (props: Props) => {
	// Props
	const { drawerOpen, setDrawerOpen, selectedDoc } = props

	// Handler untuk menutup drawer
	const handleCloseDrawer = () => {
		setDrawerOpen(false)
	}

	const document = selectedDoc?.document

	return (
		<DetailsDrawer drawerOpen={drawerOpen}>
			{selectedDoc && document && (
				<>
					{/* Header Drawer */}
					<div className='flex items-center justify-between plb-4 pli-5 border-b'>
						<div className='flex items-center gap-2 overflow-hidden'>
							<IconButton onClick={handleCloseDrawer} size='small'>
								<DirectionalIcon
									ltrIconClass='ri-arrow-left-s-line'
									rtlIconClass='ri-arrow-right-s-line'
									className='text-2xl'
								/>
							</IconButton>
							<Typography variant='h6' noWrap className='flex-grow'>
								{document.title || selectedDoc.name}
							</Typography>
						</div>
						<div className='flex items-center gap-2'>
							<Tooltip title='Download' placement='top'>
								<IconButton
									// onClick={() => window.open(document.url, '_blank')}
									href={document?.url}
        							download={document?.title || 'dokumen.pdf'}
									disabled={!document.url}
								>
									<i className='ri-download-line text-textSecondary' />
								</IconButton>
							</Tooltip>
							<Tooltip title='Tutup' placement='top'>
								<IconButton onClick={handleCloseDrawer}>
									<i className='ri-close-line text-textSecondary' />
								</IconButton>
							</Tooltip>
						</div>
					</div>

					{/* Konten Detail Dokumen */}
					<div className='grow overflow-y-auto bg-actionHover'>
						<ScrollWrapper>
							<div className='p-5'>
								<Card>
									<CardContent className='flex flex-col gap-6'>
										<Typography variant='body1' className='text-justify'>
											{document.about || 'Tidak ada deskripsi atau ringkasan untuk dokumen ini.'}
										</Typography>

										<div className='border-t pt-6'>
											<Typography variant='h6' className='mbe-4'>Detail Informasi</Typography>
											<div className='flex flex-col gap-3'>
												<MetadataRow label='Inisiator' value={document.initiator} />
												<MetadataRow label='Tipe Dokumen' value={document.document_type} />
												<MetadataRow label='Kategori' value={document.category_document} />
												<MetadataRow label='Nomor' value={document.number} />
												<MetadataRow label='Status' value={document.status} />
												<MetadataRow
													label='Tanggal Penetapan'
													value={
														document.date_of_determination
															? new Date(document.date_of_determination).toLocaleDateString('id-ID', {
																year: 'numeric',
																month: 'long',
																day: 'numeric',
															})
															: null
													}
												/>
												<MetadataRow label='Tempat Penetapan' value={document.place_of_determination} />
											</div>
										</div>
									</CardContent>
									<CardActions className='justify-end gap-2'>
										<Button
											variant='contained'
											startIcon={<i className='ri-download-2-line' />}
											// onClick={() => window.open(document.url, '_blank')}											
											href={document?.url}
											download={document?.title || 'dokumen.pdf'}
											disabled={!document.url}
										>
											Download Dokumen
										</Button>
									</CardActions>
								</Card>
							</div>
						</ScrollWrapper>
					</div>
				</>
			)}
		</DetailsDrawer>
	)
}

export default DocumentDetails