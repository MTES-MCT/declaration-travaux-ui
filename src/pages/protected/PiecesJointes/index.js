import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import AppAppBar from 'components/AppAppBar';
import AppFooter from 'components/AppFooter';
import withRoot from 'theme/withRoot';
import { withStyles, LinearProgress } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import compose from 'utils/compose';
import Typography from 'components/Typography';
import PieceJointe from './PieceJointe';
import depots from 'utils/depots';
import { useAsync } from 'react-async';
import Error from 'pages/Error';
import NotFound from 'pages/NotFound';
import { typeLibelle, pieceJointe } from 'utils/piecesjointes';

const styles = theme => ({
  grid: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
});

async function handleDepot({ id }) {
  return { depot: await depots.monDepot(id) };
}

function PiecesJointes(props) {
  const { classes, match } = props;
  const depotId = match.params.depotId;
  const {
    data = { depot: null },
    error,
    setError,
    isLoading,
    isRejected,
    reload
  } = useAsync({
    promiseFn: handleDepot,
    id: depotId
  });
  if (isRejected) return <Error error={error.message} />;
  if (isLoading) return <LinearProgress />;
  if (data) {
    const { depot } = data;
    if (!depot) return <NotFound />;
    return (
      <React.Fragment>
        <AppAppBar />
        <Typography variant="h3" marked="center" align="center">
          {`CERFA initial et pièces jointes`}
        </Typography>
        <Typography variant="subtitle1" marked="center" align="center">
          {`${typeLibelle(depot.type)}`}
        </Typography>
        <Grid container className={classes.grid}>
          <Grid item xs={12}>
            <PieceJointe
              key={depot.cerfa.numero}
              pieceJointe={pieceJointe(depot, depot.cerfa.numero)}
              setError={setError}
              reload={reload}
            />
            {depot.piecesAJoindre.map(pieceAJoindre => (
              <PieceJointe
                key={pieceAJoindre}
                pieceJointe={pieceJointe(depot, pieceAJoindre)}
                setError={setError}
                reload={reload}
              />
            ))}
          </Grid>
        </Grid>
        <AppFooter />
      </React.Fragment>
    );
  }
}
PiecesJointes.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default compose(
  withRoot,
  withRouter,
  withStyles(styles)
)(PiecesJointes);
