import React, {Component} from 'react';
import { getFollowersById } from "../services/twitterAPI";
import EnhancedTable from "./common/table";
import Fab from '@material-ui/core/Fab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

export default class Followers extends Component {
    state = {
        followers: [],
        count: 0,
        isLoading: true,
        page: 0,
        order: 'asc',
    };

    headRows = [
        { id: 'id', label: 'ID' },
        { id: 'name', label: 'Name', sortable: true },
        { id: 'screen_name', label: 'Screen Name', sortable: true },
        { id: 'description', label: 'Description' },
        { id: 'location', label: 'Location' },
    ];

    getFollowers = async (cursor = -1) => {
        const { order, orderBy } = this.state;
        const { match: { params: { id } } } = this.props;

        this.setState({ isLoading: true });

        const { followers, count, cursors } = await getFollowersById(id, cursor, orderBy ? order : undefined, orderBy);

        this.setState({ followers, count, cursors, isLoading: false });
    };

    componentDidMount() {
        this.getFollowers();
    }

    handlePageChange = async (event, newPage) => {
        const { page, cursors } = this.state;
        let cursor = page < newPage ? cursors.next : cursors.previous;
        this.setState({ page: newPage});
        await this.getFollowers(cursor);
    };

    handleRequestSort = (event, property) => {
        const { order, orderBy } = this.state;
        const isDesc = orderBy === property && order === 'desc';

        this.setState({
            order: isDesc ? 'asc' : 'desc',
            orderBy: property,
        });
    };

    handleBack = () => {
        this.props.history.push('/');
    };

    render() {
        const { isLoading, count, followers, page, order, orderBy } = this.state;

        return (
            <div>
                <Fab color="primary" aria-label="Add" size='small'>
                    <ArrowBackIcon onClick={ this.handleBack } />
                </Fab>
                <EnhancedTable
                    title="Followers"
                    rows={this.headRows}
                    data={followers}
                    totalCount={count}
                    page={page}
                    onPageChange={this.handlePageChange}
                    isLoading={isLoading}
                    order={order}
                    orderBy={orderBy}
                    onSort={this.handleRequestSort}
                />
            </div>
        );
    }
}
