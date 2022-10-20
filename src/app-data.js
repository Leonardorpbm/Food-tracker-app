export default class AppData {
  /*
  A class AppData retém todos os dados que o utilizador já inseriu no formulário.
  */
  constructor() {
    this.food = [];
  }
  /*
  //A função addFood recebe os valores inseridos pelo utilizador e passa-os para uma array
  //Utilizamos o parseInt de modo a termos a certeza de que os valores de hidratos, proteína e gordura são números e não strings.
  */
  addFood(carbs, protein, fat) {
    this.food.push({
      carbs: Number.parseInt(carbs, 10),
      protein: Number.parseInt(protein, 10),
      fat: Number.parseInt(fat, 10),
    });
  }

  //Devolve-nos o número total de hidratos em todas as refeições inseridas pelo utilizador.
  getTotalCarbs() {
    //Calcular o total através do método .reduce
    return this.food.reduce((total, current) => {
      return total + current.carbs;
    }, 0);
  }

  //Devolve-nos o número total de proteína em todas as refeições inseridas pelo utilizador.
  getTotalProtein() {
    //Calcular o total através do método .reduce
    return this.food.reduce((total, current) => {
      return total + current.protein;
    }, 0);
  }

  //Devolve-nos o número total de gordura em todas as refeições inseridas pelo utilizador.
  getTotalFat() {
    //Calcular o total através do método .reduce
    return this.food.reduce((total, current) => {
      return total + current.fat;
    }, 0);
  }

  //Devolve-nos o número total de calorias
  getTotalCalories() {
    return (
      //1 grama de hidratos contém 4 calorias
      this.getTotalCarbs() * 4 +
      //1 grama de proteína contém 4 calorias
      this.getTotalProtein() * 4 +
      //1 grama de gordura contém 9 calorias
      this.getTotalFat() * 9
    );
  }
}
