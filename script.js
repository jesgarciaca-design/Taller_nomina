const SMLV = 1750905;
const AUX_TRANSPORTE = 249095;
const UVT = 52.37;

const ARL_TARIFAS = {
  minimo: 0.00522,
  bajo: 0.01044,
  medio: 0.02436,
  alto: 0.0435,
  maximo: 0.0696
};

let nombre = "";
let edad = 0;
let tipoDocumento = "";
let numeroDocumento = "";

let salario = 0;
let comisiones = 0;
let horasExtra = 0;
let nivelRiesgo = "";

function validarUsuario(edad) {
  if (edad < 18) {
    return { valido: false, mensaje: "Menor de edad - no puede continuar" };
  }

  if (edad < 25) {
    return { valido: false, mensaje: "Usuario beneficiario por cotizante" };
  }

  if (edad >= 60) {
    return { valido: true, pensionado: true };
  }

  return { valido: true, pensionado: false };
}

function calcularRetencion(ingreso) {
  let ingresoUVT = ingreso / UVT;
  let impuestoUVT = 0;

  if (ingresoUVT <= 95) {
    impuestoUVT = 0;
  } else if (ingresoUVT <= 150) {
    impuestoUVT = (ingresoUVT - 95) * 0.19;
  } else if (ingresoUVT <= 360) {
    impuestoUVT = (ingresoUVT - 150) * 0.28 + 10;
  } else if (ingresoUVT <= 640) {
    impuestoUVT = (ingresoUVT - 360) * 0.33 + 69;
  } else if (ingresoUVT <= 945) {
    impuestoUVT = (ingresoUVT - 640) * 0.35 + 162;
  } else if (ingresoUVT <= 2300) {
    impuestoUVT = (ingresoUVT - 945) * 0.37 + 268;
  } else {
    impuestoUVT = (ingresoUVT - 2300) * 0.39 + 770;
  }

  return impuestoUVT * UVT;
}

function calcularNomina(datos) {
  let { salario, comisiones, horasExtra, riesgo } = datos;

  let totalDevengado = salario + comisiones + horasExtra;

  let auxilio = salario <= (2 * SMLV) ? AUX_TRANSPORTE : 0;

  let ibc = totalDevengado * 0.7;

  if (salario < 2 * SMLV) {
    return {
      salario,
      ibc,
      auxilio,
      salud: 0,
      pension: 0,
      fondo: 0,
      arl: 0,
      retencion: 0,
      total: totalDevengado + auxilio
    };
  }

  let salud = ibc * 0.04;
  let pension = ibc * 0.04;
  let fondo = ibc >= (4 * SMLV) ? ibc * 0.01 : 0;
  let arl = ibc * ARL_TARIFAS[riesgo];

  let base = ibc - salud - pension - fondo;

  let retencion = calcularRetencion(base);

  let deducciones = salud + pension + fondo + arl + retencion;

  let total = totalDevengado + auxilio - deducciones;

  return {
    salario,
    ibc,
    auxilio,
    salud,
    pension,
    fondo,
    arl,
    retencion,
    total
  };
}

let usuario = { edad: 30 };

let estado = validarUsuario(usuario.edad);

if (estado.valido) {
  let resultado = calcularNomina({
    salario: 2000000,
    comisiones: 300000,
    horasExtra: 200000,
    riesgo: "medio"
  });

  console.log(resultado);
} else {
  console.log(estado.mensaje);
}