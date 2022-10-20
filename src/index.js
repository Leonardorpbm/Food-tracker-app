//Importar funções javascript de outros ficheiros e bibliotecas javascript
import FetchWrapper from "./fetch-wrapper.js";
import { capitalize, calculateCalories } from "./helpers.js";
import snackbar from "snackbar";
import AppData from "./app-data.js";
import "snackbar/dist/snackbar.min.css";
import Chart from "chart.js/auto";

//API
const API = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/jsdemo-3f387/databases/(default)/documents/12214ITR"
);

//Definição de variáveis
const appData = new AppData();

const list = document.querySelector("#food-list");
const form = document.querySelector("#create-form");
const name = document.querySelector("#create-name");
const carbs = document.querySelector("#create-carbs");
const protein = document.querySelector("#create-protein");
const fat = document.querySelector("#create-fat");

const displayEntry = (name, carbs, protein, fat) => {
  /*
  O método appData.addFood() serve para cada vez que tivermos uma nova entrada no formulário, podemos ir guardando os valores
  inseridos pelo utilizador através da class AppData
  */
  appData.addFood(carbs, protein, fat);
  /*
  Adicionar os seguintes elementos HTML ao elemento com id "food-list"
  */
  list.insertAdjacentHTML(
    "beforeend",
    `<li class="card">
        <div>
          <h3 class="name">${capitalize(name)}</h3>
          <div class="calories">${calculateCalories(
            carbs,
            protein,
            fat
          )} calories</div>
          <ul class="macros">
            <li class="carbs"><div>Carbs</div><div class="value">${carbs}g</div></li>
            <li class="protein"><div>Protein</div><div class="value">${protein}g</div></li>
            <li class="fat"><div>Fat</div><div class="value">${fat}g</div></li>
          </ul>
        </div>
      </li>`
  );
};

//Se clicarmos em submit...
form.addEventListener("submit", (event) => {
  event.preventDefault();
  /*
  //Quando clicamos no input com type "submit" será feito um POST request ao Firebase API.
  //Isto irá permitir ao utilizador selecionar uma refeição do dropdown <select> e inserir o número de hidratos, proteína e gordura.
  //Quando o formulário é submetido, o POST request será enviado para o API com os dados que o utilizador inseriu.
*/
  API.post("/", {
    //Guarda os valores inseridos pelo utilizador através do .value
    fields: {
      name: { stringValue: name.value },
      carbs: { integerValue: carbs.value },
      protein: { integerValue: protein.value },
      fat: { integerValue: fat.value },
    },
  }).then((data) => {
    console.log(data);
    //Se o utilizador não inserir algum valor, então aparecerá uma notificação a dizer "some data is missing", através da biblioteca
    //snackbar.js
    if (data.error) {
      //Existe um erro
      snackbar.show("Some data is missing.");
      return;
    }
    //Caso não exista nenhum erro, aparecerá uma notificação a dizer "Food added successfully".
    //snackbar.show é um método específico da biblioteca.
    snackbar.show("Food added successfully.");

    //Quando o POST request é bem sucedido, corremos a função displayEntry que definimos na linha 24.
    displayEntry(name.value, carbs.value, protein.value, fat.value);
    render();

    //Ao sumbeter o formulário, o formulário dá reset automaticamente, uma vez que passamos o seu value para uma empty string.
    name.value = "";
    carbs.value = "";
    protein.value = "";
    fat.value = "";
  });
});

const init = () => {
  //Por padrão, o firebase API devolve-nos sempre 20 itens de cada vez.
  //No entanto, é possível mudar com "?pageSize=100", o que faz com que passemos a ter 100 entradas disponíveis em vez de 20.
  //Get request para que o API nos devolva os dados que o utilizador inseriu
  API.get("/?pageSize=100").then((data) => {
    data.documents?.forEach((doc) => {
      const fields = doc.fields;
      //Função definida na linha 24
      displayEntry(
        /*
        O parâmetro "field" é específico de um API e contém sempre um valor, se não o utilizarmos não irá funcionar
        Neste caso especificamos os "fields" que queremos guardar e dizemos que queremos guardar o name.stringValue
        */
        fields.name.stringValue,
        fields.carbs.integerValue,
        fields.protein.integerValue,
        fields.fat.integerValue
      );
    });
    render();
  });
};

//chart.js
//Utilizei a base do código presente no website: https://www.chartjs.org/docs/2.9.4/
//E personalizei-o como desejava:
let chartInstance = null;
const renderChart = () => {
  //?.destroy serve para destruir/eliminar qualquer informação que esteja guardada no gráfico de modo a que possamos dar reset
  //e atualizar com novas informações
  chartInstance?.destroy();
  const context = document.querySelector("#app-chart").getContext("2d");

  chartInstance = new Chart(context, {
    type: "bar",
    data: {
      //Nomes que irão aparecer no gráfico como legenda
      labels: ["Carbs", "Protein", "Fat"],
      datasets: [
        {
          label: "Macronutrients",
          data: [
            //Vamos buscar as funções presentes no ficheiro app-data.js
            appData.getTotalCarbs(),
            appData.getTotalProtein(),
            appData.getTotalFat(),
          ],
          //Podemos definir as cores de cada elemento - hidratos, proteína e gordura
          backgroundColor: ["#25AEEE", "#57D269", "#e31010"],
          borderWidth: 3,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
};

//Vamos buscar ao HTML o elemento com id total-calories
const totalCalories = document.querySelector("#total-calories");

const updateTotalCalories = () => {
  //Damos update ao textContent do elemento HTML com id total-calories através da class appData e associamos-lhe a função getTotalCalories()
  totalCalories.textContent = appData.getTotalCalories();
};

//Damos render do gráfico na tela
const render = () => {
  //Função definida em cima para criar o gráfico
  renderChart();
  //Update do total de calorias
  updateTotalCalories();
};

//Função que faz o GET request ao API
init();
