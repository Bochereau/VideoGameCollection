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
