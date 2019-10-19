import users from './users-mock';
import statuts from 'utils/statutsDossier';
// API de test uniquement

let principal = null;

const waitingTime = 100;

function login(id) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      if (!id)
        return reject(new Error('Connexion impossible. User id inconnu.'));
      return resolve((principal = users.find(user => user.id === id)));
    }, waitingTime);
  });
}

function logout() {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve((principal = null));
    }, waitingTime);
  });
}

function isAuthenticated() {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      return resolve(principal !== null);
    }, waitingTime);
  });
}

function isDeposant() {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      return resolve(principal.profils.includes('DEPOSANT'));
    }, waitingTime);
  });
}

function isMairie() {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      return resolve(principal.profils.includes('MAIRIE'));
    }, waitingTime);
  });
}

function isInstructeur() {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      return resolve(principal.profils.includes('INSTRUCTEUR'));
    }, waitingTime);
  });
}

function isBeta() {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      return resolve(principal.profils.includes('BETA'));
    }, waitingTime);
  });
}

function getUser() {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      if (!principal) return reject(new Error("Pas d'utilisateur connecté"));
      return resolve(principal);
    }, waitingTime);
  });
}

let dossiersFixtures = [];

function listerDossiers() {
  return new Promise((resolve, reject) => {
    setTimeout(
      function() {
        return resolve(dossiersFixtures);
      },
      function(error) {
        return reject(error);
      },
      waitingTime
    );
  });
}

function consulterDossier(id) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      return resolve(dossiersFixtures.find(dossier => dossier.id === id));
    }, waitingTime);
  });
}

function now() {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  };
  return new Intl.DateTimeFormat('fr-FR', options).format(new Date());
}

function addStatut(dossier, statutId) {
  dossier.statutActuel = statuts.find(s => s.id === statutId);
  dossier.statutActuel.dateDebut = now();
  dossier.historiqueStatuts.push(dossier.statutActuel);
}

function qualifierDossier(id) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      const dossier = dossiersFixtures.find(dossier => dossier.id === id);
      addStatut(dossier, 'QUALIFIE');
      return resolve(dossier);
    }, waitingTime);
  });
}

function instruireDossier(id) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      const dossier = dossiersFixtures.find(dossier => dossier.id === id);
      addStatut(dossier, 'INSTRUCTION');
      return resolve(dossier);
    }, waitingTime);
  });
}

function declarerIncompletDossier(id, message) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      const dossier = dossiersFixtures.find(dossier => dossier.id === id);
      addStatut(dossier, 'INCOMPLET');
      dossier.messages = [
        {
          contenu: message,
          auteur: principal,
          date: now()
        }
      ];
      return resolve(dossier);
    }, waitingTime);
  });
}

function declarerCompletDossier(id) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      const dossier = dossiersFixtures.find(dossier => dossier.id === id);
      addStatut(dossier, 'COMPLET');
      return resolve(dossier);
    }, waitingTime);
  });
}

function typeFromCerfa(fileName) {
  let type = '';
  if (fileName && fileName.length > 0) {
    if (fileName.toUpperCase().includes('13406_PCMI'))
      type = {
        id: 'PCMI',
        libelle: 'Permis de construire de maison individuelle'
      };
    if (fileName.toUpperCase().includes('13703_DPMI'))
      type = { id: 'DPMI', libelle: 'Déclaration préalable' };
  }
  return type;
}

function cerfaError(file) {
  return `Fichier CERFA ${file.name} non reconnu. Seuls les fichiers nommés cerfa_13406_PCMI.pdf ou cerfa_13703_DPMI.pdf sont reconnus.`;
}

function saveInSessionStorage(dossier, numero, file) {
  const reader = new FileReader();
  reader.onload = function() {
    const binaryStr = reader.result;
    sessionStorage.setItem(
      dossier.type.id + numero,
      JSON.stringify({
        nom: file.name,
        type: file.type,
        size: file.size,
        data: URL.createObjectURL(new Blob([binaryStr], { type: file.type }))
      })
    );
  };
  reader.readAsBinaryString(file);
}

function ajouterDossier(formData) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      let file = formData.get('file');
      const type = typeFromCerfa(file.name);
      if (type === '') return reject(new Error(cerfaError(file)));
      const dossier = {
        id: dossiersFixtures.length.toString(),
        type: type,
        userId: principal.id,
        cerfa: {
          type: type,
          numero: '0',
          fichierId: type.id + '0',
          dossierId: dossiersFixtures.length.toString()
        },
        piecesAJoindre: ['1'],
        piecesJointes: [],
        historiqueStatuts: [],
        messages: []
      };
      addStatut(dossier, 'DEPOSE');
      saveInSessionStorage(dossier, '0', file);
      dossiersFixtures.push(dossier);
      return resolve();
    }, waitingTime);
  });
}

function checkCode(code, file) {
  if (!file.name) return true; // hack because cypress dropzone command have undefined file.name
  const type = typeFromCerfa(file.name);
  return code.includes('cerfa') ? code === type.id + '0' : true;
}

function savePieceJointe(dossierId, numero, formData) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      let file = formData.get('file');
      if (!checkCode(numero, file)) throw new Error(cerfaError(file));
      let dossier = dossiersFixtures.find(dossier => dossier.id === dossierId);
      saveInSessionStorage(dossier, numero, file);
      dossier.piecesJointes.push({
        type: dossier.type,
        numero: numero,
        fichierId: dossier.type.id + numero,
        DossierId: dossierId
      });
      return resolve();
    }, waitingTime);
  });
}

function lireFichier(id) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      return resolve(JSON.parse(sessionStorage.getItem(id)));
    }, waitingTime);
  });
}

const auth = {
  login,
  isAuthenticated,
  logout,
  getUser,
  isDeposant,
  isMairie,
  isInstructeur,
  isBeta
};
const dossiers = {
  listerDossiers,
  consulterDossier,
  ajouterDossier,
  savePieceJointe,
  lireFichier,
  qualifierDossier,
  instruireDossier,
  declarerIncompletDossier,
  declarerCompletDossier
};

const api = {
  auth,
  dossiers
};

export default api;
