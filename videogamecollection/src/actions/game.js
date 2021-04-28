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

// // action to update videogameList filtered
// export const UPDATED_VIDEOGAME_LIST = 'UPDATED_VIDEOGAME_LIST';
// export const updatedVideogameList = (search, filterGame, filterHardware) => ({
//   type: UPDATED_VIDEOGAME_LIST,
//   search,
//   filterGame,
//   filterHardware,
// });
