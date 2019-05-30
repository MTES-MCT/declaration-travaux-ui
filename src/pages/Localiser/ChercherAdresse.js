import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

const maxWidth = 400;

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  container: {
    position: 'relative'
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  suggestion: {
    display: 'flex'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },
  input: {
    [theme.breakpoints.down('xs')]: {
      width: maxWidth * 0.75
    },
    width: maxWidth
  }
});

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      data-cy="chercher-adresse-input"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input
        }
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
        {parts.map((part, key) => (
          <span key={key} style={{ fontWeight: part.highlight ? 500 : 400 }}>
            {part.text}
          </span>
        ))}
      </div>
    </MenuItem>
  );
}

class ChercherAddresse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adresse: '',
      adresses: [],
      error: ''
    };
  }

  buildSuggestions = result => {
    return result.features.map(feature => {
      var suggestion = {};
      suggestion.value = feature.properties.id;
      suggestion.label = feature.properties.label;
      suggestion.position = [
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0]
      ];
      return suggestion;
    });
  };

  sanitizedAdresse = adresse => {
    return deburr(adresse.trim()).toLowerCase();
  };

  rechercherAdresses = async () => {
    const adresseUrl = 'https://api-adresse.data.gouv.fr/search/?q=';
    const adresse = this.sanitizedAdresse(this.state.adresse);
    return await fetch(
      adresseUrl + adresse + '&citycode=' + this.props.commune.code
    )
      .then(res => res.json())
      .then(
        result => this.buildSuggestions(result),
        error => {
          this.setState({
            error
          });
        }
      );
  };

  onSuggestionsFetchRequested = async () => {
    this.setState({ adresses: await this.rechercherAdresses() });
  };

  onSuggestionsClearRequested = () => {
    this.setState({ adresses: [] });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    this.setState({ adresse: suggestion });
    this.props.onClickSelectAddress(suggestion);
  };

  getSuggestionValue(suggestion) {
    return suggestion.label;
  }

  shouldRenderSuggestions(value) {
    return value.trim().length > 3;
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      adresse: newValue
    });
  };

  onBlur = (event, { highlightedSuggestion }) => {
    if (highlightedSuggestion) {
      this.setState({ adresse: highlightedSuggestion });
      this.props.onClickSelectAddress(highlightedSuggestion);
    }
  };

  render() {
    const { classes, commune } = this.props;
    const { adresse, adresses } = this.state;
    const inputProps = {
      classes,
      placeholder: 'Ex: 1 rue des Fleurs...',
      value: adresse,
      onChange: this.onChange,
      onBlur: this.onBlur
    };
    const theme = {
      container: classes.container,
      suggestionsContainerOpen: classes.suggestionsContainerOpen,
      suggestionsList: classes.suggestionsList,
      suggestion: classes.suggestion
    };
    return (
      <div className={classes.root}>
        <Autosuggest
          key={`autosuggest-${commune.code}`}
          data-cy={`chercher-adresse-input`}
          suggestions={adresses}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={renderSuggestion}
          renderInputComponent={renderInputComponent}
          inputProps={inputProps}
          theme={theme}
          renderSuggestionsContainer={options => (
            <Paper {...options.containerProps} square>
              {options.children}
            </Paper>
          )}
        />
      </div>
    );
  }
}

ChercherAddresse.propTypes = {
  classes: PropTypes.object,
  commune: PropTypes.object.isRequired,
  onClickSelectAddress: PropTypes.func.isRequired
};

export default withStyles(styles)(ChercherAddresse);
