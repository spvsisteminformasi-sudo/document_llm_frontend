
// React Imports
import { useMemo } from 'react'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import { Box, SvgIcon, SvgIconProps } from '@mui/material'
import { styled, alpha } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip'
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem'
import type { TreeItemProps } from '@mui/x-tree-view/TreeItem'
// import { useMaster } from '@/hooks/useMaster'
import { useEffect, useState } from 'react'
import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { ListRequest, ListResponse, DataResponse, useAxios } from '@/hooks/useAxios'
import { TagType } from '@/entities/tag'
import { useRouter } from 'next/navigation'

import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { CircularProgress } from '@mui/material'

const CustomTreeItem_classic = styled(TreeItem)({
	[`& .${treeItemClasses.iconContainer}`]: {
		'& .close': {
			opacity: 0.3,
		},
	},
});

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
	color: theme.palette.grey[200],
	[`& .${treeItemClasses.content}`]: {
		alignItems: 'flex-start',
		width: '100%',
		overflow: 'hidden',
		// borderRadius: theme.spacing(0.5),
		// padding: theme.spacing(0.5, 1),
		// margin: theme.spacing(0.2, 0),
		[`& .${treeItemClasses.label}`]: {
			alignItems: 'flex-start',
			fontSize: '0.8rem',
			fontWeight: 500,
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			paddingRight: theme.spacing(2)
		},
	},
	[`& .${treeItemClasses.iconContainer}`]: {
		alignItems: 'flex-start',
		// borderRadius: '50%',
		// backgroundColor: theme.palette.primary.dark,
		// padding: theme.spacing(0, 1.2),
		...theme.applyStyles('light', {
			alignItems: 'flex-start',
			// backgroundColor: alpha(theme.palette.primary.main, 0.25),
		}),
		...theme.applyStyles('dark', {
			alignItems: 'flex-start',
			color: theme.palette.primary.contrastText,
		}),
	},
	[`& .${treeItemClasses.groupTransition}`]: {
		alignItems: 'flex-start',
		// marginLeft: 15,
		// paddingLeft: 18,
		borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
	},
	...theme.applyStyles('light', {
		alignItems: 'flex-start',
		color: theme.palette.grey[800],
	}),
}));

const CustomTreeItem = (props: TreeItemProps) => {
	const { label, ...other } = props;

	// Buat elemen label yang sudah dibungkus dengan Tooltip
	const labelWithTooltip = (
		<Tooltip title={label as string} placement="right" arrow>
			{/* Div ini penting agar Tooltip punya elemen untuk 'dipegang' 
                dan agar truncation style bisa diterapkan dengan benar. */}
			<div>{label}</div>
		</Tooltip>
	);

	// Kembalikan StyledTreeItem dengan label yang sudah dimodifikasi
	return <StyledTreeItem label={labelWithTooltip} {...other} />;
}

function CloseSquare(props: SvgIconProps) {
	return (
		<SvgIcon
			className="close"
			fontSize="inherit"
			style={{ width: 14, height: 14 }}
			{...props}
		>
			{/* tslint:disable-next-line: max-line-length */}
			<path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
		</SvgIcon>
	);
}

import FolderIcon from '@mui/icons-material/Folder'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import DescriptionIcon from '@mui/icons-material/Description'

import FolderRounded from '@mui/icons-material/FolderRounded'
import FolderOpenRounded from '@mui/icons-material/FolderOpenRounded'
import InsertDriveFileRounded from '@mui/icons-material/InsertDriveFileRounded'
import PictureAsPdfRounded from '@mui/icons-material/PictureAsPdfRounded'
import ImageRounded from '@mui/icons-material/ImageRounded'

const buildNodeMap = (nodes: TagType[]): Map<string, TagType> => {
	const map = new Map<string, TagType>();
	const recurse = (nodeList: TagType[]) => {
		for (const node of nodeList) {
			if (node.item_id) {
				map.set(`${node.item_id}`, node);
			}
			if (node.children && node.children.length > 0) {
				recurse(node.children);
			}
		}
	};
	recurse(nodes);
	return map;
};


type Props = {
	treeData: TagType[] | null;
	isLoading: boolean;
	onItemSelected: (tag: TagType) => void;
	scrollMenu?: (container: any, isFinished: boolean) => void; // Opsional jika masih dipakai
}

const TreeviewDocument = ({ scrollMenu, treeData, isLoading, onItemSelected }: Props) => {

	const nodeMap = useMemo(() => {
		return treeData ? buildNodeMap(treeData) : new Map();
	}, [treeData]);

	if (isLoading) {
		return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
	}

	if (!treeData) {
		return <Box sx={{ p: 5 }}>No data available.</Box>
	}

	return (
		<Box
			className='bs-full overflow-y-auto overflow-x-hidden'
			sx={{ height: '100%' }}
			onScroll={(e) => scrollMenu(e.currentTarget, false)}
		>
			<Box
				sx={{
					marginLeft: 3,
				}}
			>
				<RichTreeView
					items={treeData || []}
					sx={{
						'& .MuiTreeItem-label': {
							alignItems: 'flex-start'
						}
					}}
					getItemLabel={(item) => item.name}
					getItemId={(item) => `${item.item_id}`}
					// onItemClick={(event, itemId) => {
					// 	const id = itemId.split('-')[0]
					// 	fetchSelectedTag({ url: '/api/portal/tags/' + id, method: 'get' })
					// }}

					onItemSelectionToggle={(event, itemId) => {
						// Logika di dalam sini tidak perlu diubah.
						if (itemId) {
							const selectedNode = nodeMap.get(itemId);
							if (selectedNode) {
								onItemSelected(selectedNode);
							}
						}
					}}

					slots={{
						expandIcon: FolderRounded,
						collapseIcon: FolderOpenRounded,
						// endIcon: InsertDriveFileRounded,
						endIcon: (props) => {
							if (props.item?.document?.mime_type === 'application/pdf') {
								return <PictureAsPdfRounded color="error" fontSize="small" />
							}
							return <InsertDriveFileRounded color="warning" fontSize="small" />
						},
						item: CustomTreeItem,
					}}
				/>
			</Box>
		</Box>
	)
}

export default TreeviewDocument
