// function that find videogame name with id
function videogameName(list, gameId) {
  // eslint-disable-next-line no-underscore-dangle
  const videogame = list.find((videogames) => videogames._id === gameId);
  return videogame.name;
}

export default videogameName;
