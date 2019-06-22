import React from 'react';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';

function renderInputComponent(inputProps) {
    const { classes, inputRef = () => {}, ref, ...other } = inputProps;

    return (
        <TextField
            fullWidth
            InputProps={{
                inputRef: node => {
                    ref(node);
                    inputRef(node);
                },
                classes: {
                    input: classes.input,
                },
            }}
            {...other}
        />
    );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
    const matches = match(suggestion.label, query);
    const parts = parse(suggestion.label, matches);

    return (
        <MenuItem selected={isHighlighted} component="div">
            <div>
                {parts.map(part => (
                    <span key={part.text} style={{ fontWeight: part.highlight ? 500 : 400 }}>
                        {part.text}
                    </span>
                ))}
                &nbsp;<span>({suggestion.followers})</span>
            </div>
        </MenuItem>
    );
}

function getSuggestions(value, options = []) {
    const inputLength = value.length;
    let count = 0;

    return inputLength === 0
        ? []
        : options.filter(suggestion => {
            const keep =
                count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === value;

            if (keep) {
                count += 1;
            }

            return keep;
        });
}

function getSuggestionValue(suggestion) {
    return suggestion.label;
}

const useStyles = makeStyles(theme => ({
    root: {
        height: 250,
        flexGrow: 1,
    },
    container: {
        position: 'relative',
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing(1),
        left: 0,
        right: 0,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    divider: {
        height: theme.spacing(2),
    },
    loading: {
        padding: theme.spacing(1),
    }
}));

export default function Autocomplete({ onFetchSuggestions, onChange, onSelected, value, isLoading }) {
    const classes = useStyles();
    const [stateAnchorEl, setAnchorEl] = React.useState(null);
    const [stateSuggestions, setSuggestions] = React.useState([]);

    const handleSuggestionsFetchRequested = async ({ value }) => {
        const inputValue = deburr(value.trim()).toLowerCase();
        const options = await onFetchSuggestions(inputValue);
        setSuggestions(getSuggestions(inputValue, options));
    };

    const handleSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const autosuggestProps = {
        renderInputComponent,
        suggestions: stateSuggestions,
        onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
        onSuggestionsClearRequested: handleSuggestionsClearRequested,
        getSuggestionValue,
        renderSuggestion,
        onSuggestionSelected: onSelected,
    };

    return (
        <div className={classes.root}>
            <Autosuggest
                {...autosuggestProps}
                inputProps={{
                    classes,
                    id: 'react-autosuggest-popper',
                    label: 'Twitter Account',
                    placeholder: 'Search account by name',
                    value,
                    onChange,
                    inputRef: node => {
                        setAnchorEl(node);
                    },
                    InputLabelProps: {
                        shrink: true,
                    },
                }}
                theme={{
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
                renderSuggestionsContainer={options => (
                    <Popper anchorEl={stateAnchorEl} open={Boolean(options.children)}>
                        <Paper
                            square
                            {...options.containerProps}
                            style={{ width: stateAnchorEl ? stateAnchorEl.clientWidth : undefined }}
                        >
                            {isLoading ? <div className={classes.loading}>loading . . .</div> : options.children}
                        </Paper>
                    </Popper>
                )}
            />
        </div>
    );
}