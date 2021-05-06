import React from 'react'
import { format } from 'date-fns'
import {
    DataGrid,
    GridCellParams,
    GridColDef,
    GridValueFormatterParams,
    GridToolbar,
    GridRowParams,
} from '@material-ui/data-grid'
import Alert, { Color } from '@material-ui/lab/Alert'
import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'

import CancelIcon from '@material-ui/icons/Cancel'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
// import CreateIcon from '@material-ui/icons/Create'
// import DeleteIcon from '@material-ui/icons/Delete'
// import EditIcon from '@material-ui/icons/Edit'
// import SearchIcon from '@material-ui/icons/Search'

import {
    COLUMNS,
    Subscription,
    Pagination,
    ContainFilterUser,
} from '../../utils'
import { getSubscriptions as getSubs } from '../../services'

import styles from './ActiveSubscribersList.module.scss'
import { Typography } from '@material-ui/core'

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

interface ActiveSubscribersListState {
    loading: boolean
    subscribers: Subscription[]
    alert: {
        message: string
        severity: Color
        open: boolean
    }
    pages: Pagination
    filter: ContainFilterUser
}
interface ActiveSubscribersListProps {}

class ActiveSubscribersList extends React.PureComponent<
    ActiveSubscribersListProps,
    ActiveSubscribersListState
> {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            subscribers: [],
            alert: {
                message: '',
                severity: 'info',
                open: false,
            },
            pages: {
                offset: 0,
                limit: 100,
            },
            filter: '',
        }
    }
    setAlert = (
        open: boolean,
        message: string = this.state.alert.message,
        severity: Color = this.state.alert.severity
    ) => {
        this.setState<'alert'>({ alert: { open, message, severity } })
    }
    handleAlertClose = () => {
        this.setAlert(false)
    }
    getSubscriptions = async () => {
        try {
            this.setState<'loading'>({ loading: true })
            const { pages } = this.state
            const { data: subscriptions } = await getSubs(pages)
            this.setState<'subscribers'>({ subscribers: subscriptions })
        } catch (err) {
            this.setAlert(true, err.message, 'error')
        } finally {
            this.setState<'loading'>({ loading: false })
        }
    }
    rowClickHandler = (vals: GridRowParams) => {
        const message = `The username who has the name ${vals.getValue(
            'username'
        )} has following interests - \n ${vals.getValue('interests')}`
        alert(message)
    }
    componentDidMount() {
        this.getSubscriptions()
    }
    render() {
        const {
            loading: dataGridLoading,
            subscribers = [],
            alert: { open: alertOpen, severity, message },
        } = this.state
        return (
            <Grid
                container
                className={styles.activeSubscribersList}
                direction="column"
                alignItems="stretch"
            >
                <Typography
                    variant="h6"
                    color="primary"
                    align="center"
                    className={styles.title}
                >
                    :: Subscribers List ::
                </Typography>
                <DataGrid
                    rows={subscribers}
                    columns={columns}
                    loading={dataGridLoading}
                    className={styles.list}
                    disableSelectionOnClick
                    components={{
                        Toolbar: GridToolbar,
                    }}
                    onRowDoubleClick={this.rowClickHandler}
                />
                <Snackbar
                    open={alertOpen}
                    onClose={this.handleAlertClose}
                    autoHideDuration={1600}
                >
                    <Alert onClose={this.handleAlertClose} severity={severity}>
                        {message}
                    </Alert>
                </Snackbar>
            </Grid>
        )
    }
}

export { ActiveSubscribersList }
