import React, { ChangeEvent } from 'react'
import {
    Dialog,
    TextField,
    Typography,
    Grid,
    IconButton,
    Button,
    useMediaQuery,
    CircularProgress,
} from '@material-ui/core'

import CancelIcon from '@material-ui/icons/Cancel'
import DeleteIcon from '@material-ui/icons/Delete'

import { Validate, COLUMNS, COLUMNS_ATTRIBS } from '../../../utils'

import styles from './ActiveSubscriberModal.module.scss'

interface ActiveSubscriberModalProps {
    open: boolean
    onClose(): void
    getField(key: string): Validate<any>
    setField(key: string, value: any): void
    onOk(): void
    onReset(): void
    loading: boolean
    onDelete(): void
    editMode: boolean
}

export const ActiveSubscriberModal = ({
    open,
    onClose,
    getField,
    setField,
    onOk,
    loading,
    onDelete,
    editMode
}: ActiveSubscriberModalProps) => {
    const isBP600 = useMediaQuery('(min-width:600px')
    if (!open) return null
    const username = {
        ...getField(COLUMNS.USERNAME),
        setter: (ev: ChangeEvent<HTMLInputElement>) =>
            setField(COLUMNS.USERNAME, ev.target.value),
    }
    const interests = {
        ...getField(COLUMNS.INTERESTS),
        setter: (ev: ChangeEvent<HTMLInputElement>) =>
            setField(COLUMNS.INTERESTS, ev.target.value),
    }
    const planType = {
        ...getField(COLUMNS.PLAN_TYPE),
        setter: (ev: ChangeEvent<HTMLInputElement>) =>
            setField(COLUMNS.PLAN_TYPE, ev.target.value),
        options: COLUMNS_ATTRIBS[COLUMNS.PLAN_TYPE].enums,
    }
    const admPoints = {
        ...getField(COLUMNS.ADMIRATION_POINTS),
        setter: (ev: ChangeEvent<HTMLInputElement>) =>
            setField(COLUMNS.ADMIRATION_POINTS, ev.target.value),
    }
    const subsDate = {
        ...getField(COLUMNS.SUBSCRIPTION_DATE),
        setter: false,
    }
    const expDate = {
        ...getField(COLUMNS.EXPIRY_DATE),
        setter: (ev: ChangeEvent<HTMLInputElement>) =>
            setField(COLUMNS.EXPIRY_DATE, new Date(ev.target.value).valueOf()),
    }
    const isActive = {
        ...getField(COLUMNS.IS_ACTIVE),
        setter: (ev: ChangeEvent<HTMLInputElement>) =>
            setField(
                COLUMNS.IS_ACTIVE,
                ev.target.value === 'Yes' ? true : false
            ),
    }
    isActive.value = isActive.value ? 'Yes' : 'No'
    const size = isBP600 ? 'medium' : 'small'
    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            className={styles.activeSubscriberModal}
        >
            <Grid
                className={styles.content}
                direction="column"
                alignItems="stretch"
                wrap="nowrap"
                justify="center"
                container
            >
                <Grid
                    container
                    item
                    className={styles.header}
                    wrap="nowrap"
                    alignItems="center"
                    justify="space-between"
                >
                    <Grid item>
                        <Typography color="primary" align="center" variant="h5">
                            :: Record Details ::
                        </Typography>
                    </Grid>
                    <Grid item>
                        {editMode && (
                            <IconButton
                            onClick={onDelete}
                            disabled={loading}
                            color="secondary"
                            >
                                <DeleteIcon />
                            </IconButton>
                        )}
                        <IconButton
                            onClick={onClose}
                            disabled={loading}
                            color="primary"
                        >
                            <CancelIcon />
                        </IconButton>

                        {loading && (
                            <CircularProgress
                                size="medium"
                                className={styles.progress}
                            />
                        )}
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    className={styles.body}
                    alignItems="stretch"
                    direction="column"
                >
                    <TextField
                        disabled={loading}
                        size={size}
                        label="Username"
                        value={username.value}
                        onChange={username.setter}
                        error={!!username.error}
                        helperText={username.error}
                        variant="outlined"
                        required
                        autoFocus
                        placeholder="Enter the username"
                    />
                    <TextField
                        disabled={loading}
                        size={size}
                        label="Interests"
                        value={interests.value}
                        onChange={interests.setter}
                        error={!!interests.error}
                        helperText={interests.error}
                        rows={10}
                        rowsMax={5}
                        multiline
                        variant="outlined"
                        placeholder="Enter the interests"
                    />
                    <TextField
                        disabled={loading}
                        size={size}
                        label="Admiration Points"
                        value={admPoints.value}
                        onChange={admPoints.setter}
                        error={!!admPoints.error}
                        helperText={admPoints.error}
                        variant="outlined"
                        type="number"
                        inputProps={{
                            min: 0,
                            max: 5,
                            step: 0.1,
                        }}
                    />
                    <TextField
                        disabled={true}
                        size={size}
                        label="Subscription Date"
                        defaultValue={subsDate.value}
                        type="date"
                        variant="outlined"
                        InputProps={{
                            readOnly: true,
                        }}
                        required
                    />
                    <TextField
                        disabled={loading}
                        size={size}
                        label="Expiry Date"
                        type="date"
                        value={expDate.value}
                        onChange={expDate.setter}
                        error={!!expDate.error}
                        helperText={expDate.error}
                        variant="outlined"
                        required
                    />
                    <TextField
                        disabled={loading}
                        size={size}
                        label="Plan"
                        select
                        value={planType.value}
                        onChange={planType.setter}
                        error={!!planType.error}
                        helperText={planType.error}
                        variant="outlined"
                        required
                    >
                        {planType.options.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt.toUpperCase()}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        disabled={loading}
                        size={size}
                        label="Active"
                        select
                        value={isActive.value}
                        onChange={isActive.setter}
                        error={!!isActive.error}
                        helperText={isActive.error}
                        variant="outlined"
                        required
                    >
                        {['Yes', 'No'].map((opt) => (
                            <option key={opt} value={opt}>
                                {opt.toUpperCase()}
                            </option>
                        ))}
                    </TextField>
                </Grid>
                <Grid
                    container
                    item
                    className={styles.footer}
                    wrap="nowrap"
                    justify="space-around"
                    alignItems="center"
                >
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button color="primary" variant="contained" onClick={onOk}>
                        Add/Update
                    </Button>
                </Grid>
            </Grid>
        </Dialog>
    )
}
