import AccountIcon from '@material-ui/icons/AccountCircle';
import MonCompte from 'pages/protected/MonCompte';
import SignOutIcon from '@material-ui/icons/LockOpen';
import PiecesJointes from 'pages/protected/PiecesJointes';
import Localiser from 'pages/protected/Localiser';
import MapIcon from '@material-ui/icons/Map';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import Cgu from 'pages/Cgu';
import Aide from 'pages/Aide';
import AideIcon from '@material-ui/icons/Help';
import Depots from 'pages/protected/Depots';
import Depot from 'pages/protected/Depots/Depot';

const routes = [
  {
    id: 'depots',
    path: '/depots',
    label: 'Lister',
    icon: SaveAltIcon,
    component: Depots,
    sidebar: true,
    exact: true
  },
  {
    id: 'depot',
    path: '/depots/:id',
    label: 'Dépôt',
    icon: SaveAltIcon,
    component: Depot,
    sidebar: false,
    exact: true
  },
  {
    id: 'piecesjointes',
    path: '/depots/:depotId/piecesjointes',
    label: 'Pièces jointes',
    icon: SaveAltIcon,
    component: PiecesJointes,
    sidebar: false
  },
  {
    id: 'localiser',
    path: '/localiser',
    label: 'Localiser',
    icon: MapIcon,
    component: Localiser,
    sidebar: true,
    beta: true
  },
  {
    id: 'moncompte',
    path: '/moncompte',
    label: 'Mon compte',
    icon: AccountIcon,
    component: MonCompte,
    sidebar: true,
    auth: true
  },
  {
    id: 'deconnexion',
    label: 'Déconnexion',
    icon: SignOutIcon,
    sidebar: true,
    auth: true
  },
  {
    id: 'aide',
    path: '/aide',
    label: 'Aide',
    icon: AideIcon,
    component: Aide,
    sidebar: false
  },
  {
    id: 'cgu',
    path: '/cgu',
    label: 'CGU',
    icon: null,
    component: Cgu,
    sidebar: false
  }
];

export default routes;
