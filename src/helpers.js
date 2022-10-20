export const capitalize = (word) => {
  //Esta função dá upper case ao primeiro caracter e lower case aos restantes caracteres da palavra que é inserida.
  return word[0].toUpperCase() + word.substring(1).toLowerCase();
};

export const calculateCalories = (carbs = 0, protein = 0, fat = 0) => {
  //Esta função recebe os valores de hidratos, proteína e gordura, e devolve o número de calorias ao multiplicar cada valor.
  return carbs * 4 + protein * 4 + fat * 9;
};
