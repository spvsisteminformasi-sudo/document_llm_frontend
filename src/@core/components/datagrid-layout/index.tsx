// ** React Imports

// ** MUI Imports
import { DataGridLayoutType } from './index.type'
import { Card, CardContent, CardHeader, Divider, Grid } from '@mui/material'
import { DataGrid, GridCallbackDetails, GridPaginationModel, GridRowSelectionModel } from '@mui/x-data-grid'

const DataGridLayout = (props: DataGridLayoutType) => {
    const {
        title,
        header,
        isLoadingList,
        data,
        columns,
        rowCount,
        pageSize,
        page,
        onSortChange,
        onPaginationModelChange,
        onRowClick,
        onCellClick,
        checkboxSelection,
        keepNonExistentRowsSelected,
        onSelectionModelChange,
        columnVisibilityModel,
        isRowSelectable,
        height = '70vh',
        selectionModel,
        hasCard = true,
        sx
    } = props

    const renderBody = (
        <>
            {title && <CardHeader title={title} />}
            {header && <CardContent>{header}</CardContent>}
            {title && <Divider />}
            <div style={{ width: '100%', height: height }}>
                <DataGrid
                    sx={sx}
                    loading={isLoadingList}
                    rows={data}
                    initialState={{
                        pagination: { paginationModel: { pageSize: pageSize, page: page } },
                        columns: {
                            columnVisibilityModel: columnVisibilityModel,
                        },
                    }}
                    columns={columns}
                    rowCount={rowCount}
                    paginationMode={'server'}
                    sortingMode="server"
                    onSortModelChange={onSortChange}
                    onPaginationModelChange={(model: GridPaginationModel) => {
                        onPaginationModelChange(model.pageSize, model.page)
                    }}
                    onRowClick={onRowClick}
                    checkboxSelection={checkboxSelection}
                    onCellClick={onCellClick}
                    keepNonExistentRowsSelected={
                        keepNonExistentRowsSelected
                    }
                    onRowSelectionModelChange={(rowSelectionModel: GridRowSelectionModel) => {
                        if (onSelectionModelChange) {
                            onSelectionModelChange(rowSelectionModel)
                        }
                    }}
                    isRowSelectable={isRowSelectable}
                    rowSelectionModel={selectionModel}
                />
            </div>
        </>
    )

    return (
        <>
            {hasCard ? (
                <Card>
                    <CardContent>
                        {renderBody}
                    </CardContent>
                </Card>
            ) : renderBody}
        </>
    )
}

export default DataGridLayout
