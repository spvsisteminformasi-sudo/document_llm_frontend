// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

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
import { TreeItem, treeItemClasses, type TreeItemProps } from '@mui/x-tree-view/TreeItem'
import Tooltip from '@mui/material/Tooltip'
import { useMaster } from '@/hooks/useMaster'
import { useEffect, useState } from 'react'
import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import { DataResponse, useAxios } from '@/hooks/useAxios'
import { TagType } from '@/entities/tag'
import { useRouter } from 'next/navigation'

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

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
  const labelWithTooltip = (
    <Tooltip title={label as string} placement="right" arrow>
      <div>{label}</div>
    </Tooltip>
  );

  return <StyledTreeItem label={labelWithTooltip} {...other} />;
}

import FolderRounded from '@mui/icons-material/FolderRounded'
import FolderOpenRounded from '@mui/icons-material/FolderOpenRounded'
import InsertDriveFileRounded from '@mui/icons-material/InsertDriveFileRounded'
import PictureAsPdfRounded from '@mui/icons-material/PictureAsPdfRounded'

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { tag, fetchTag } = useMaster()
  const [selectedTag, setSelectedTag] = useState<TagType>()
  const router = useRouter()

  useEffect(() => {
    fetchTag()
  }, [])
  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  const {
    isLoading: isLoadingTag,
    statusCode: statusCodeTag,
    data: dataTag,
    fetch: fetchSelectedTag,
  } = useAxios<DataResponse<TagType>, TagType>({
    url: '/api/tags/',
    method: 'get',
  })

  useEffect(() => {
    if (isLoadingTag && statusCodeTag === null) {
      return
    }

    if (statusCodeTag === 200) {
      setSelectedTag(dataTag?.data)
    } else if (!dataTag?.success && dataTag?.message) {
    }
  }, [isLoadingTag, statusCodeTag, dataTag])

  useEffect(() => {
    if (selectedTag?.document_id && selectedTag?.page_number) {
      router.push(`/admin/documents/edit/${selectedTag.document_id}?page=${selectedTag.page_number}`)
    }
    if (selectedTag?.document_id) {
      router.push('/admin/documents/edit/' + selectedTag.document_id)
    }
  }, [selectedTag])

  const randomId = Math.random().toString(36).substring(2, 15)

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
          className: 'bs-full overflow-y-auto overflow-x-hidden',
          onScroll: container => scrollMenu(container, false)
        }
        : {
          options: { wheelPropagation: false, suppressScrollX: true },
          onScrollY: container => scrollMenu(container, true)
        })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Box sx={{ marginLeft: 3, minHeight: 352, minWidth: 250 }}>
        <RichTreeView items={tag}
          getItemLabel={(item) => item.name}
          getItemId={(item) => `${item.item_id}`}
          onItemClick={(event, itemId) => {
            const id = itemId.split('-')[0]
            fetchSelectedTag({ url: '/api/tags/' + id, method: 'get' })
          }}
          slots={{
            expandIcon: FolderRounded,
            collapseIcon: FolderOpenRounded,
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
    </ScrollWrapper>
  )
}

export default VerticalMenu
