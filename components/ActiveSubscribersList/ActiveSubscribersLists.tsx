import React from 'react'
import { DataGrid, GridToolbar, GridRowParams } from '@material-ui/data-grid'
import Alert, { Color } from '@material-ui/lab/Alert'
import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'
import { Typography, withWidth, IconButton } from '@material-ui/core'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import { addMonths } from 'date-fns'

import AddCircleIcon from '@material-ui/icons/AddCircle'

import {
    Subscription,
    Pagination,
    ContainFilterUser,
    Validate,
    COLUMNS_ATTRIBS,
    COLUMNS,
    PLAN_TYPES,
} from '../../utils'
import {
    getSubscriptions as getSubs,
    editSubscription as editSub,
    addSubscripton as addSub,
    removeSubscription as removeSub,
} from '../../services'
import { ActiveSubscriberModal } from './ActiveSubscriberModal'

import styles from './ActiveSubscribersList.module.scss'

import columns from './columns'

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
    dialog: {
        open: boolean
        record: Partial<Subscription>
        editMode: boolean
    }
    addUpdate: {
        record: Partial<Subscription>
    }
}
interface ActiveSubscribersListProps {
    width: Breakpoint
}

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
            dialog: {
                open: false,
                record: {},
                editMode: false,
            },
            addUpdate: {
                record: {},
            },
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
        const selected: Partial<Subscription> = {
            id: vals.row.id as string,
        }
        columns.forEach(({ field }) => {
            selected[field] = vals.getValue(field)
        })
        this.setState({
            dialog: { open: true, record: selected, editMode: true },
            addUpdate: { record: selected },
        })
    }
    handleDialogClose = () => {
        this.setState({
            dialog: { open: false, record: {}, editMode: false },
            addUpdate: { record: {} },
        })
    }
    getFieldValue = (key: string): Validate<any> => {
        const recValue = this.state.addUpdate.record[key]
        const valid = COLUMNS_ATTRIBS[key]?.valid
            ? key === COLUMNS.EXPIRY_DATE
                ? COLUMNS_ATTRIBS[key].valid(
                      recValue,
                      this.state.addUpdate.record[COLUMNS.SUBSCRIPTION_DATE]
                  )
                : COLUMNS_ATTRIBS[key].valid(recValue)
            : {
                  value: recValue,
              }
        if (COLUMNS_ATTRIBS[key]?.format) {
            valid.value = COLUMNS_ATTRIBS[key].format(valid.value)
        }
        return valid
    }
    setFieldValue = (key: string, value: any) => {
        const addUpdate = this.state.addUpdate
        this.setState<'addUpdate'>({
            addUpdate: {
                ...addUpdate,
                record: { ...addUpdate.record, [key]: value },
            },
        })
    }
    handleResetRecord = () => {
        const record = this.state.dialog.record
        this.setState<'addUpdate'>({ addUpdate: { record } })
    }
    handleAddUpdateRecord = async () => {
        try {
            const {
                dialog: { editMode },
                addUpdate: {
                    record: { id, ...record },
                },
            } = this.state
            this.setState<'loading'>({ loading: true })
            if (editMode) {
                await editSub(id, record)
            } else {
                await addSub(record)
            }
            this.handleDialogClose()
            this.getSubscriptions()
        } catch (error) {
            this.setState<'alert'>({
                alert: {
                    message: error?.message || 'Operation incomplete',
                    severity: 'error',
                    open: true,
                },
            })
            this.setState<'loading'>({ loading: false })
        }
    }
    createSubscription = () => {
        const record: Partial<Subscription> = {
            [COLUMNS.SUBSCRIPTION_DATE]: new Date().valueOf(),
            [COLUMNS.USERNAME]: '',
            [COLUMNS.ADMIRATION_POINTS]: 0,
            [COLUMNS.EXPIRY_DATE]: addMonths(new Date(), 1).valueOf(),
            [COLUMNS.PLAN_TYPE]: PLAN_TYPES.FREE_TRIAL,
            [COLUMNS.INTERESTS]: '',
            [COLUMNS.IS_ACTIVE]: false,
        }
        this.setState({
            dialog: { record, editMode: false, open: true },
            addUpdate: { record },
        })
    }
    handleDeleteRecord = async () => {
        try {
            this.setState<'loading'>({ loading: true })
            const { id } = this.state.dialog.record
            await removeSub(id)
            this.handleDialogClose()
            this.getSubscriptions()
        } catch (error) {
            this.setState<'loading'>({ loading: false })
            this.setState<'alert'>({
                alert: {
                    message: error?.message || 'Delete unsuccessful',
                    severity: 'error',
                    open: true,
                },
            })
        }
    }
    componentDidMount() {
        this.getSubscriptions()
    }
    render() {
        const {
            loading: dataGridLoading,
            subscribers = [],
            alert: { open: alertOpen, severity, message },
            dialog: { open: dialogOpen },
        } = this.state
        const { width } = this.props
        const components = width === 'xs' ? {} : { Toolbar: GridToolbar }

        return (
            <Grid
                container
                className={styles.activeSubscribersList}
                direction="column"
                alignItems="stretch"
            >
                <Grid
                    item
                    container
                    wrap="nowrap"
                    justify="center"
                    alignItems="center"
                >
                    <Typography
                        variant="h6"
                        color="primary"
                        align="center"
                        className={styles.title}
                    >
                        :: Subscribers List ::
                    </Typography>
                    <Grid item className={styles.addControl}>
                        <IconButton
                            color="primary"
                            title="Create subscription"
                            onClick={this.createSubscription}
                        >
                            <AddCircleIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <DataGrid
                    rows={subscribers}
                    columns={columns}
                    loading={dataGridLoading}
                    className={styles.list}
                    disableSelectionOnClick
                    components={components}
                    onRowClick={this.rowClickHandler}
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
                <ActiveSubscriberModal
                    loading={dataGridLoading}
                    open={dialogOpen}
                    onClose={this.handleDialogClose}
                    getField={this.getFieldValue}
                    setField={this.setFieldValue}
                    onOk={this.handleAddUpdateRecord}
                    onReset={this.handleResetRecord}
                    onDelete={this.handleDeleteRecord}
                />
            </Grid>
        )
    }
}

const ActiveSubscribersListWrapped = withWidth()(ActiveSubscribersList)

export { ActiveSubscribersListWrapped as ActiveSubscribersList }
