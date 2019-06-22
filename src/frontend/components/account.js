import React, {Component} from 'react';
import Autocomplete from "./common/autocomplete";
import { getAccountsByName } from "../services/twitterAPI";
import debounce from 'lodash/debounce';

export default class Account extends Component {
    state = {
        value: '',
        isLoading: false,
    };

    debouncedLoader = debounce(getAccountsByName, 1000);

    handleFetchSuggestions = async value => {
        this.setState({ isLoading: true });

        let options = [];
        await new Promise((resolve) => {
            this.debouncedLoader(value, results => {
                options = results;
                resolve();

                this.setState({ isLoading: false });
            })
        });

        return options;
    };

    handleChange = (event, { newValue }) => {
        this.setState({ value: newValue });
    };

    handleSelection = (event, { suggestion }) => {
        this.props.history.push(`/followers/${suggestion.id}`);
    };

    render() {
        const { value, isLoading } = this.state;

        return (
            <Autocomplete
                value={ value }
                isLoading={ isLoading }
                onFetchSuggestions={ this.handleFetchSuggestions }
                onChange={ this.handleChange }
                onSelected={ this.handleSelection }
            />
        );
    }
}
