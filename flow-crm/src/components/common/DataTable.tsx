'use client';

import React from 'react';
import { DataGrid, DataGridProps, GridColDef } from '@mui/x-data-grid';
import { Box, useTheme, Card } from '@mui/material';

interface DataTableProps extends Omit<DataGridProps, 'rows' | 'columns'> {
    rows: any[];
    columns: GridColDef[];
    loading?: boolean;
    height?: number | string;
}

const DataTable: React.FC<DataTableProps> = ({
    rows,
    columns,
    loading = false,
    height = 500,
    ...props
}) => {
    const theme = useTheme();

    return (
        <Card
            sx={{
                height: height,
                width: '100%',
                boxShadow: theme.shadows[2],
                borderRadius: 3,
                overflow: 'hidden'
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                pagination
                slotProps={{
                    loadingOverlay: {
                        variant: 'linear-progress',
                        noRowsVariant: 'skeleton',
                    },
                }}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 10, page: 0 },
                    },
                }}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
                sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell': {
                        borderColor: theme.palette.divider,
                        fontSize: '0.875rem',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: theme.palette.text.secondary
                    },
                    '& .MuiDataGrid-footerContainer': {
                        borderTop: `1px solid ${theme.palette.divider}`,
                    }
                }}
                {...props}
            />
        </Card>
    );
};

export default DataTable;
