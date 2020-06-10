const five = require("johnny-five")
const board = new five.Board()
const firebase = require("firebase")

const firebaseConfig = require('./config/firebase')

board.on("ready", function () {
  console.log("> Green House is ready to run!")

  var temperature = new five.Thermometer({
    pin: "A1"
  });

  temperature.on("data", function () {
    console.log("Celcius: %d", this.C, "°C");
  });

  var hygrometer = new five.Hygrometer({
    controller: "TH02"
  });

  hygrometer.on("change", function () {
    console.log("> Umidade relativa do ar: ", this.relativeHumidity);
  });

  var luzes = new five.Led(10)

  var coolers = new five.Relay(6)

  var bombas = new five.Relay(5)

  this.repl.inject({
    luzes: luzes,
    coolers: coolers,
    bombas: bombas

  })

  firebase.initializeApp(firebaseConfig)

  var alterarEstadoLuz = firebase.database()
    .ref('releLuzes')
    .on('value', snapshot => {
      let releLuzes = snapshot.val()

      if (releLuzes == 'on') {
        luzes.on()
      } else {
        luzes.off()
      }

    })

  var alterarEstadoCoolers = firebase.database()
    .ref('releCoolers')
    .on('value', snapshot => {
      let releCoolers = snapshot.val()

      if (releCoolers == 'on') {
        coolers.on()
      } else {
        coolers.off()
      }

    })

  var alterarEstadoIrrigacao = firebase.database()
    .ref('estadoIrrigacao')
    .on('value', snapshot => {
      let estadoIrrigacao = snapshot.val()

      if (estadoIrrigacao == 'on') {
        setInterval(() => {
          bombas.on()
        }, 2000)

        bombas.off()

      } else {
        bombas.off()
      }

    })

})