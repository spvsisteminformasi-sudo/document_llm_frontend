'use client'

// React Imports
import { useEffect, useMemo, useRef, useState } from 'react'
import { ListRequest, ListResponse, DataResponse, useAxios } from '@/hooks/useAxios'

// MUI Imports
import { useMediaQuery, Box } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import SidebarLeft from './SidebarLeft'
import MailContent from './MailContent'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { commonLayoutClasses } from '@layouts/utils/layoutClasses'

import { useConfig } from '@/context/configContext'
import type { TagType } from '@/entities/tag'

const flattenApiData = (nodes: any[]): TagType[] => {
	let flatList: TagType[] = [];
	nodes.forEach(node => {
		if (node.tag_type === 'file' && node.document) {
			flatList.push(node);
		}
		if (node.children && node.children.length > 0) {
			flatList = flatList.concat(flattenApiData(node.children));
		}
	});
	return flatList;
};

const sortDocumentsByDate = (documents: TagType[]): TagType[] => {
    return documents.sort((a, b) => {
        // Pastikan document dan date_of_determination ada
        const dateA = a.document?.date_of_determination;
        const dateB = b.document?.date_of_determination;

        // Jika B tidak punya tanggal, taruh di akhir
        if (!dateB) return -1;
        // Jika A tidak punya tanggal, taruh di akhir
        if (!dateA) return 1;

        // Urutkan secara menurun (descending)
        return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
};

const PedomanWrapper = ({ folder, label }: { folder?: string; label?: string }) => {
	// States
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [backdropOpen, setBackdropOpen] = useState(false)
	const [selectedTag, setSelectedTag] = useState<TagType | null>(null)

	// Hooks
	const { settings } = useSettings()
	const { setConfig } = useConfig()
	const isBelowLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
	const isBelowMdScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
	const isBelowSmScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

	const [sidebarWidth, setSidebarWidth] = useState(260)
	const resizerRef = useRef<HTMLDivElement>(null)
	const sidebarRef = useRef<HTMLDivElement>(null)
	const isResizing = useRef(false)
	const startX = useRef(0)
	const startWidth = useRef(0)

	// const [offsetX, setOffsetX] = useState(0)
	const offsetX = useRef(0);

	const {
		data: initialTagData,
		isLoading,
		error: initialTagError,
		fetch: fetchTag,
	} = useAxios<ListResponse<TagType>, ListRequest>({
		url: '/api/portal/tags?full=true'
	});

	useEffect(() => {
		fetchTag()
	}, [])

	const handleRefresh = () => {
		setSelectedTag(null);
		fetchTag();
	};

	const documents = useMemo(() => {
		let flatList: TagType[] = [];
		if (selectedTag) {
			if (selectedTag.tag_type === 'folder' && selectedTag.children) {
				flatList = flattenApiData(selectedTag.children);				
				return sortDocumentsByDate(flatList);
				// return flattenApiData(selectedTag.children);
			}
			if (selectedTag.tag_type === 'file') {
				flatList = [selectedTag]; 				
				return sortDocumentsByDate(flatList);
				// return [selectedTag];
			}
		}
		if (initialTagData?.data) {		
			flatList = flattenApiData(initialTagData.data);					
			return sortDocumentsByDate(flatList);
			// return flattenApiData(initialTagData.data);
		}
		return [];
	}, [selectedTag, initialTagData]);

	const handleBackdropClick = () => {
		setSidebarOpen(false)
		setBackdropOpen(false)
	}

	useEffect(() => {
		if (initialTagError) {
			console.error("Error fetching initial tag data:", initialTagError);
		}
	}, [initialTagError]);

	useEffect(() => {
		if (backdropOpen && !sidebarOpen) {
			setBackdropOpen(false)
		}
	}, [sidebarOpen])

	useEffect(() => {
		if (backdropOpen && !isBelowMdScreen) {
			setBackdropOpen(false)
		}
		if (sidebarOpen && !isBelowMdScreen) {
			setSidebarOpen(false)
		}
	}, [isBelowMdScreen])

	useEffect(() => {
		setConfig({
			hideFooter: true
		})
		return () => setConfig({})
	}, [setConfig])

	const containerRef = useRef<HTMLDivElement>(null) 

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isResizing.current) return
			
			const containerWidth = window.innerWidth
			const newWidth = startWidth.current + e.clientX - startX.current
			const minWidth = containerWidth * 0.2
			const maxWidth = containerWidth * 0.8
			const constrainedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth)
			
			setSidebarWidth(constrainedWidth)
		}

		const handleMouseUp = () => {
			isResizing.current = false
      		document.body.style.cursor = ''
			document.body.style.userSelect = ''
			document.body.removeEventListener('mousemove', handleMouseMove)
			document.body.removeEventListener('mouseup', handleMouseUp)
		}

		const handleMouseDown = (e: MouseEvent) => {
			if (!sidebarRef.current) return
			
			isResizing.current = true
			startX.current = e.clientX
			startWidth.current = sidebarWidth
			
			document.body.style.cursor = 'col-resize'
			document.body.style.userSelect = 'none'
			window.addEventListener('mousemove', handleMouseMove)
			window.addEventListener('mouseup', handleMouseUp)
		}

		const resizer = resizerRef.current
		if (resizer) resizer.addEventListener('mousedown', handleMouseDown)
		return () => {
			if (resizer) resizer.removeEventListener('mousedown', handleMouseDown)
			document.body.removeEventListener('mousemove', handleMouseMove)
			document.body.removeEventListener('mouseup', handleMouseUp)
		}
	}, [sidebarWidth])

	return (
		<Box
			className='relative overflow-hidden pbs-[70px] -mbs-[70px] bg-backgroundPaper z-[1]'
			sx={{
				height: 'calc(100vh - 8px)',
				overflow: 'hidden'
			}}
		>
			<div
				// ref={containerRef}
				className={classnames(commonLayoutClasses.contentHeightFixed, 'flex is-full overflow-hidden rounded relative', {
					border: settings.skin === 'bordered',
					'shadow-md': settings.skin !== 'bordered'
				})}
				style={{
					height: '100%',
					display: 'flex',
					flexDirection: 'row',
					position: 'relative'
				}}
			>
				{(!isBelowMdScreen || sidebarOpen) && (
				<div
					ref={sidebarRef}
					style={{
						// width: sidebarWidth,
						// minWidth: 100,
						// maxWidth: 600,
						width: isBelowMdScreen ? '260' : sidebarWidth,
						minWidth: isBelowMdScreen ? '260' : '20%',
						maxWidth: isBelowMdScreen ? '260' : '80%',
						transition: isResizing.current ? 'none' : 'width 0.2s ease',
						overflow: 'hidden',
						flexShrink: 0
					}}
				>
					<SidebarLeft
						treeData={initialTagData?.data}
						isLoading={isLoading}
						isBelowLgScreen={isBelowLgScreen}
						isBelowMdScreen={isBelowMdScreen}
						isBelowSmScreen={isBelowSmScreen}
						sidebarOpen={sidebarOpen}
						setSidebarOpen={setSidebarOpen}
						onTagSelected={setSelectedTag}
					/>
				</div>
				)}
				
				{!isBelowMdScreen && (
				<div
					ref={resizerRef}
					style={{
						width: '5px',
						cursor: 'col-resize',
						backgroundColor: '#e0e0e0',
						zIndex: 10,
						transition: 'background-color 0.2s ease-in-out',
						height: '100%',
						flexShrink: 0
					}}					
					onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#bbb')}
					onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
				/>
				)}
					
				<div 
					style={{ 
						flexGrow: 1, 
						overflow: 'hidden',
          				minWidth: 0 
					}}
				>
					<MailContent
						documents={documents}
						isLoading={isLoading}
						setSidebarOpen={setSidebarOpen}
						isBelowLgScreen={isBelowLgScreen}
						isBelowMdScreen={isBelowMdScreen}
						isBelowSmScreen={isBelowSmScreen}
						setBackdropOpen={setBackdropOpen}
						selectedTag={selectedTag}
						onTagSelected={setSelectedTag}
						onRefresh={handleRefresh}
					/>
				</div>
				<Backdrop open={backdropOpen} onClick={handleBackdropClick} className='absolute z-10' />
			</div>
		</Box>
	)
}

export default PedomanWrapper
