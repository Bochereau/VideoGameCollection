/*
GAME FRONT INTERACTION
*/

// action that get the game id for showing more detail
export const GET_GAME_ID = 'GET_GAME_ID';
export const getGameId = (gameId) => ({
  type: GET_GAME_ID,
  gameId,
});

// action that display the section details
export const SHOW_DETAILS = 'SHOW_DETAILS';
export const showDetails = () => ({
  type: SHOW_DETAILS,
});

// action for openning add game modal
export const SHOW_GAME_MODAL = 'SHOW_GAME_MODAL';
export const showGameModal = () => ({
  type: SHOW_GAME_MODAL,
});

// action for adding a new game in the list
export const ADD_VIDEOGAME = 'ADD_VIDEOGAME';
export const addVideogame = (newVideogame) => ({
  type: ADD_VIDEOGAME,
  newVideogame,
});

// action to save filter slug
export const SAVE_GAME_FILTER = 'SAVE_GAME_FILTER';
export const saveGameFilter = (filterGame) => ({
  type: SAVE_GAME_FILTER,
  filterGame,
});

// action to change finished game status
export const FINISHED_GAME = 'FINISHED_GAME';
export const finishedGame = (finished) => ({
  type: FINISHED_GAME,
  finished,
});

// action to save active add button
export const SAVE_ACTIVE_ADD_BUTTON = 'SAVE_ACTIVE_ADD_BUTTON';
export const saveActiveAddButton = (button) => ({
  type: SAVE_ACTIVE_ADD_BUTTON,
  button,
});

// action to open GAME's hardware list
export const TOGGLE_GAME = 'TOGGLE_GAME';
export const toggleGame = (game) => ({
  type: TOGGLE_GAME,
  game,
});

/* Add game form */

// action to change new game name value
export const NEW_GAME_NAME = 'NEW_GAME_NAME';
export const newGameName = (nameValue) => ({
  type: NEW_GAME_NAME,
  nameValue,
});

// action to select console for new game
export const NEW_GAME_HARDWARE = 'NEW_GAME_HARDWARE';
export const newGameHardware = (hardware) => ({
  type: NEW_GAME_HARDWARE,
  hardware,
});

// action to change game editor value
export const NEW_GAME_EDITOR = 'NEW_GAME_EDITOR';
export const newGameEditor = (editorValue) => ({
  type: NEW_GAME_EDITOR,
  editorValue,
});

// action to change game developer value
export const NEW_GAME_DEVELOPER = 'NEW_GAME_DEVELOPER';
export const newGameDeveloper = (developerValue) => ({
  type: NEW_GAME_DEVELOPER,
  developerValue,
});

// action to change game release date value
export const NEW_GAME_RELEASE = 'NEW_GAME_RELEASE';
export const newGameRelease = (releaseValue) => ({
  type: NEW_GAME_RELEASE,
  releaseValue,
});
