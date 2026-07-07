// components/TreeView.tsx

'use client'

import { useEffect, useState } from 'react'
import { Box, useTheme, Typography } from '@mui/material'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem'
import { styled } from '@mui/material/styles'

import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useMaster } from '@/hooks/useMaster'
import { useAxios, DataResponse, ListRequest, ListResponse } from '@/hooks/useAxios'
import type { TagType } from '@/entities/tag'
import DirectionalIcon from '@components/DirectionalIcon'
import { useRouter } from 'next/navigation'
import { RichTreeView } from '@mui/x-tree-view/RichTreeView'

// Icons
import FolderIcon from '@mui/icons-material/Folder'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
  query?: string
}

// Styled component untuk memindahkan expand icon ke kanan
const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingRight: theme.spacing(1),
    padding: '0.5rem 0.75rem',
    [`& .${treeItemClasses.label}`]: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '180px',

      display: 'flex',
      // alignItems: 'center',
      gap: theme.spacing(1)
    }
  },
  [`& .${treeItemClasses.content}`]: {
    marginLeft: 0,
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(2)
  },
}))

type CustomTreeItemProps = {
  node: TagType
  onSelect: (id: string) => void
}

const CustomTreeItem = ({ node, onSelect }: CustomTreeItemProps) => (
  <StyledTreeItem
    className='flex flex-col gap-1'
    itemId={`${node.id}`}
    label={
      <div
        className='flex items-center w-full'
        onClick={() => {
          onSelect(`${node.id}`)
        }}
      >
        {node.children?.length > 0 && (
          <DirectionalIcon
            className='text-textDisabled text-xl align-top'
            ltrIconClass='ri-arrow-down-s-line'
            rtlIconClass='ri-arrow-down-s-line'
          />
        )}
        <Typography component='span' color='inherit'>
          {node.name}
        </Typography>
      </div>
    }
  >
    {Array.isArray(node.children) &&
      node.children.map((child) => (
        <CustomTreeItem key={child.id} node={child} onSelect={onSelect} />
      ))}
  </StyledTreeItem>
)

const TreeView = ({ scrollMenu, query }: Props) => {
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const [tagTree, setTagTree] = useState<TagType[]>([])
  const [selectedTag, setSelectedTag] = useState<TagType>()
  const router = useRouter()
  const [tag, setTag] = useState<TagType[]>([])

  const { isBreakpointReached } = verticalNavOptions
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  const {
    isLoading: isLoadingSelectedTag,
    statusCode: statusCodeSelectedTag,
    data: dataSelectedTag,
    fetch: fetchSelectedTag,
  } = useAxios<DataResponse<TagType>, TagType>({
    url: '/api/portal/tags/',
    method: 'get',
  })

  useEffect(() => {
    if (isLoadingSelectedTag && statusCodeSelectedTag === null) {
      return
    }

    if (statusCodeSelectedTag === 200) {
      setSelectedTag(dataSelectedTag?.data)
    } else if (!dataSelectedTag?.success && dataSelectedTag?.message) {
    }
  }, [isLoadingSelectedTag, statusCodeSelectedTag, dataSelectedTag])

  useEffect(() => {
    if (selectedTag?.document_id && selectedTag?.page_number) {
      router.push(`/article/${selectedTag.document_id}?page=${selectedTag.page_number}`)
    }
    if (selectedTag?.document_id) {
      router.push('/article/' + selectedTag.document_id)
    }
  }, [selectedTag])

  const {
    isLoading: isLoadingTag,
    statusCode: statusCodeTag,
    data: dataTag,
    fetch: fetchTag,
  } = useAxios<ListResponse<TagType>, ListRequest>({
    url: '/api/portal/tags?full=true&query=' + query,
  })

  useEffect(() => {
    if (isLoadingTag && statusCodeTag === null) {
      return
    }
    if (statusCodeTag === 200 && dataTag?.data) {
      setTag(dataTag.data)
    }
  }, [isLoadingTag, statusCodeTag, dataTag])

  useEffect(() => {
    fetchTag()
  }, [])

  useEffect(() => {
    fetchTag()
  }, [query])

  useEffect(() => {
    if (Array.isArray(tag)) {
      //const normalizedData = normalizeTreeData(tag).filter(
      // (item) => item.id && item.id !== 'undefined'
      //)
      setTagTree(tag)
    }
  }, [tag])

  const randomId = Math.random().toString(36).substring(2, 15)

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const labels = document.querySelectorAll(`.${treeItemClasses.label}`)
      labels.forEach((label) => {
        if (!label.getAttribute('title')) {
          label.setAttribute('title', label.textContent || '')
        }
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }, [])

  const renderItemLabel = (item: TagType) => {
    console.log(item);
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {item.children && item.children.length > 0 ? (
          <FolderIcon fontSize="small" color="primary" />
        ) : (
          <InsertDriveFileIcon fontSize="small" color="action" />
        )}
        <Typography
          component="span"
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '250px',
            ml: 1
          }}
        >
          {item.label}
        </Typography>
      </Box>
    )
  }

  const renderItem = (props: any) => {
    const { item, children } = props

    if (!item) return null

    const isFolder = item.tag_type === 'folder' || (item.children && item.children.length > 0)
    const isFile = item.tag_type === 'file'

    return (
      <StyledTreeItem
        {...props}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isFolder ? (
              props.expanded ? (
                <FolderOpenIcon fontSize="small" color="primary" />
              ) : (
                <FolderIcon fontSize="small" color="primary" />
              )
            ) : isFile ? (
              <InsertDriveFileIcon fontSize="small" color="action" />
            ) : null}
            <Typography
              component="span"
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '250px',
                ml: 1
              }}
            >
              {item.name || 'Untitled'}
            </Typography>
          </Box>
        }
        slots={{
          groupTransition: ({ children: transitionChildren, ...other }) => (
            <Box component="ul" {...other}>
              {transitionChildren}
            </Box>
          )
        }}
      >
        {children}
      </StyledTreeItem>
    )
  }

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <ScrollWrapper
        {...(isBreakpointReached
          ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: (container: any) => scrollMenu(container, false)
          }
          : {
            options: { wheelPropagation: true, suppressScrollX: true },
            onScrollY: (container: any) => scrollMenu(container, true)
          })}
      >
        <Box sx={{
          marginLeft: 0,
          minHeight: '100%',
          minWidth: 250
        }}>
          {tagTree.length > 0 ? (
            <RichTreeView
              items={tag}
              getItemLabel={(item) => item.name}
              getItemId={(item) => `${item.item_id}`}
              onItemClick={(event, itemId) => {
                const id = itemId.split('-')[0]
                fetchSelectedTag({ url: '/api/portal/tags/' + id, method: 'get' })
              }}
              sx={{
                '& .MuiTreeItem-label': {
                  alignItems: 'flex-start'
                  // whiteSpace: 'nowrap',
                  // overflow: 'hidden',
                  // textOverflow: 'ellipsis',
                  // maxWidth: '300px', // Adjust this value as needed
                }
              }}
            // slots={{
            //   item: renderItemLabel
            // }}
            />
          ) : (
            <Typography>No tags available</Typography>
          )}
        </Box>
      </ScrollWrapper>
    </Box>
  )
}

export default TreeView
