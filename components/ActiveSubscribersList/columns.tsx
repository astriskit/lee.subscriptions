import {
    GridCellParams,
    GridColDef,
    GridValueFormatterParams,
} from '@material-ui/data-grid'
import { format } from 'date-fns'
import CancelIcon from '@material-ui/icons/Cancel'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'

import { COLUMNS } from '../../utils'

const dtFrmt = 'dd/MM/yyyy hh:mm aa OOOO'

const columns: GridColDef[] = [
    { field: COLUMNS.USERNAME, width: 200, headerName: 'Username' },
    { field: COLUMNS.INTERESTS, width: 300, headerName: 'Interests' },
    {
        field: COLUMNS.PLAN_TYPE,
        headerName: 'Plan',
        width: 160,
        valueFormatter: (params: GridValueFormatterParams) =>
            params.value.toString().toUpperCase(),
    },
    {
        field: COLUMNS.ADMIRATION_POINTS,
        type: 'number',
        headerName: 'Admiration Type',
        width: 160,
        align: 'center',
    },
    {
        field: COLUMNS.SUBSCRIPTION_DATE,
        type: 'datetime',
        headerName: 'Subscription Date',
        width: 250,
        valueFormatter: (params: GridValueFormatterParams) =>
            format(Number(params.value), dtFrmt),
    },
    {
        field: COLUMNS.EXPIRY_DATE,
        headerName: 'Validity Date',
        width: 250,
        type: 'datetime',
        valueFormatter: (params: GridValueFormatterParams) =>
            format(Number(params.value), dtFrmt),
    },
    {
        field: COLUMNS.IS_ACTIVE,
        headerName: 'Active',
        renderCell: (params: GridCellParams) =>
            params.value ? <CheckCircleIcon /> : <CancelIcon />,
    },
]

export default columns
