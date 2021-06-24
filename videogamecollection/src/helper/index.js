// function that find videogame name with id
function videogameName(videogamesList, gameId) {
  // eslint-disable-next-line no-underscore-dangle
  const videogame = videogamesList.find((videogames) => videogames._id === gameId);
  return videogame.name;
}

export default videogameName;
