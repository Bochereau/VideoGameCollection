/**
 * give a new id
 * @param {array} items - an array of object with id
 * @return {number} the new id
 */
export default function generateId(items) {
  // partant d'un tableau d'objet obtenir un tableau de nombre
  const ids = items.map((item) => item.id);
  // trouver le plus grand nombre du tableau
  const max = Math.max(...ids);
  // ajouter 1
  const newId = max + 1;
  return newId;
}
