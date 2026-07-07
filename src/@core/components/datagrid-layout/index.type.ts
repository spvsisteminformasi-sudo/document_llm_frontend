import { GridCellParams, GridColDef, GridRowParams, GridRowSelectionModel, GridSortModel, MuiEvent } from '@mui/x-data-grid'
import { ReactNode } from 'react'
import { SxProps, Theme } from '@mui/material'

export interface DataGridLayoutType {
    title?: string
    subtitle?: string
    header?: ReactNode
    isLoadingList: boolean
    data: any[]
    columns: GridColDef<any>[]
    rowCount: number
    pageSize: number
    page: number
    columnVisibilityModel?: any
    onSortChange: (sortModel: GridSortModel) => void
    onPaginationModelChange: (pageSize: number, page: number) => void
    onRowClick?: (params: any) => void
    onCellClick?: (params: GridCellParams, event: MuiEvent<React.MouseEvent>) => void;
    checkboxSelection?: boolean
    keepNonExistentRowsSelected?: boolean
    onSelectionModelChange?: (ids: GridRowSelectionModel) => void
    isRowSelectable?: ((params: GridRowParams) => boolean) | undefined
    selectionModel?: any[]
    height?: string
    hasCard?: boolean
    headerHeight?: number
    sx?: SxProps<Theme>
}
export interface CellType<T> {
    row: T
}
