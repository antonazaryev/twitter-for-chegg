import React from 'react';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import CircularProgress from "@material-ui/core/CircularProgress";

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array = [], cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

function EnhancedTableHead(props) {
    const { rows, order, orderBy, onRequestSort } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {rows.map(row => (
                    <TableCell
                        key={row.id}
                        align="left"
                        padding="default"
                        sortDirection={orderBy === row.id ? order : false}
                    >
                        {
                            row.sortable ? (
                                <TableSortLabel
                                    active={orderBy === row.id}
                                    direction={order}
                                    onClick={createSortHandler(row.id)}
                                >
                                    {row.label}
                                </TableSortLabel>
                            ) : row.label
                        }
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
}));

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { title } = props;

    return (
        <Toolbar
            className={classes.root}
        >
            <div className={classes.title}>
                <Typography variant="h6" id="tableTitle">
                    {title}
                </Typography>
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
                <Tooltip title="Filter list">
                    <IconButton aria-label="Filter list">
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            </div>
        </Toolbar>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    loading: {
        display: 'flex',
        flexDirection: 'column',
        margin: 30,
        alignItems: 'center',
    },
    tableWrapper: {
        overflowX: 'auto',
    },
}));

export default function EnhancedTable(props) {
    const {
        title,
        rows,
        data,
        totalCount,
        page,
        onPageChange,
        isLoading,
        order,
        orderBy,
        onSort,
    } = props;

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar title={title} />
                <div className={classes.tableWrapper}>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size="medium"
                    >
                        <EnhancedTableHead
                            rows={rows}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={onSort}
                            rowCount={totalCount}
                        />
                        <TableBody>
                            {
                                isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <div className={classes.loading}>
                                                <CircularProgress disableShrink/>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    stableSort(data, getSorting(order, orderBy))
                                        .map(row => {
                                            return (
                                                <TableRow
                                                    hover
                                                    tabIndex={-1}
                                                    key={row.id}
                                                >
                                                    {
                                                        rows.map(r => <TableCell key={r.id} align="left">{row[r.id]}</TableCell>)
                                                    }
                                                </TableRow>
                                            );
                                        })
                                )
                            }
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    component="div"
                    count={totalCount}
                    rowsPerPage={30}
                    rowsPerPageOptions={[30]}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={onPageChange}
                />
            </Paper>
        </div>
    );
}