/**
 * Motor Reutilizable de Comentarista Familiar Multijuegos (JUNTOS JUGAMOS)
 * Diseñado para abastecer de locución, humor familiar y comentarios en tiempo real
 * a cualquier juego de la plataforma (Bingo, Trivia, Stop, Memoria, Parqués).
 */

// 1. BANCO DE FRASES DE PRESIÓN AL LÍDER (20+ Frases Reutilizables)
export const LEADER_PRESSURE_BANK = [
  (name) => `¡Alguien que le ponga freno a ${name} que viene volando sin frenos!`,
  (name) => `¡Ojo todos en la mesa que ${name} ya siente el olor del trofeo!`,
  (name) => `¡Atención familia, ${name} va comandando la partida con mano firme!`,
  (name) => `¡Alerta máxima en la sala, ${name} está acariciando la victoria!`,
  (name) => `¡Que alguien le pida una pausa a ${name} que nos va a dejar a todos atrás!`,
  (name) => `¡${name} viene encendido como un motor de carreras!`,
  (name) => `¡Aprieten el paso que ${name} no está pidiendo permiso!`,
  (name) => `¡El trono de la casa ahora mismo lo reclama ${name}!`,
  (name) => `¡Se busca rival para ${name}, que viene imparable hoy!`,
  (name) => `¡Tranquilos todos, pero ${name} está jugando a nivel profesional!`,
  (name) => `¡Esa racha de ${name} está dando envidia de la buena!`,
  (name) => `¡Cuidado que ${name} viene pisando fuerte el acelerador!`,
  (name) => `¡${name} se tomó un café cargado antes de jugar hoy!`,
  (name) => `¡La buena suerte se mudó a la silla de ${name}!`,
  (name) => `¡Mucho ojo con ${name}, que no da tregua ni un segundo!`,
  (name) => `¡${name} trae la racha dorada en el bolsillo!`,
  (name) => `¡Si siguen descuidándose, ${name} se lleva el trofeo a casa!`,
  (name) => `¡Increíble la precisión de ${name} en este juego!`,
  (name) => `¡${name} está dando cátedra de juego rápido!`,
  (name) => `¡Alguien que llame a los bomberos que la tabla de ${name} está echando chispas!`,
  (name) => `¡Partida estelar de ${name}, que viene marcando el ritmo!`
];

// 2. BANCO DE CHANZAS SANAS AL COLERO (20+ Frases Cariñosas y Respetuosas)
export const UNDERDOG_TEASING_BANK = [
  (name) => `¡Un aplauso de aliento para ${name}, que está guardando toda la suerte para el remate!`,
  (name) => `¡Tranquilo ${name}, acuérdate que los últimos serán los primeros!`,
  (name) => `¡${name} está aplicando la famosa estrategia del cazador sigiloso!`,
  (name) => `¡${name}, despiértame a la buena suerte que se nos quedó dormida!`,
  (name) => `¡Mucha fe ${name}, que las mejores cosas de la vida se hacen esperar!`,
  (name) => `¡${name} está jugando con la serenidad de un maestro zen!`,
  (name) => `¡No se rinda ${name}, que un buen remate cambia la historia!`,
  (name) => `¡${name} está analizando el terreno antes de dar el gran golpe!`,
  (name) => `¡Sople las cartas o los botones ${name}, para que baje la bendición del juego!`,
  (name) => `¡${name} nos está dando ventaja para hacer el juego más emocionante!`,
  (name) => `¡Fuerza ${name}, que la remontada épica está por comenzar!`,
  (name) => `¡${name} es el rey de la paciencia en la mesa familiar!`,
  (name) => `¡Atención todos, que cuando ${name} arranque no lo para nadie!`,
  (name) => `¡${name} está guardando los ases bajo la manga para el final!`,
  (name) => `¡Ánimo ${name}, que la suerte da muchas vueltas en este juego!`,
  (name) => `¡${name} prefiere la emoción de ganar viniendo de atrás!`,
  (name) => `¡Envíenle buena vibra a ${name} para que rompa la racha!`,
  (name) => `¡${name} está acumulando energía para el grito de victoria!`,
  (name) => `¡Que no cunda el pánico ${name}, que esto no se acaba hasta que se acaba!`,
  (name) => `¡${name} está jugando con el corazón y la sonrisa intacta!`,
  (name) => `¡Aplausos de la barra brava para ${name}!`
];

// 3. BANCO DE EVENTOS Y COMENTARIOS DE AMBIENTE (20+ Frases Generales)
export const GAME_EVENT_BANK = [
  "¡Preparen los dedos que la partida está caliente!",
  "¡Revisen bien la pantalla que aquí nadie puede pestañear!",
  "¡El juego giró y la suerte ya tomó su decisión!",
  "¡El que no esté atento se queda fuera de la foto de la victoria!",
  "¡Soplen los celulares y la TV para que llegue la suerte buena!",
  "¡Concentración total en la mesa de la familia Loaiza Sille!",
  "¡Esta jugada estuvo de película de acción!",
  "¡Se siente la tensión sabrosa del juego en vivo!",
  "¡Cualquiera puede dar la sorpresa en los próximos segundos!",
  "¡Qué gran nivel de juego estamos viendo hoy en familia!",
  "¡El trofeo busca dueño y la mesa está encendida!",
  "¡Ni en la final del mundial se vive tanta emoción!",
  "¡Atención en la sala que la suerte cambió de bando!",
  "¡No despeguen la vista ni un segundo!",
  "¡Marque con fe y convicción!",
  "¡La tabla está que echa chispas hoy!",
  "¡Un sorbo de agua para los nervios y a seguir jugando!",
  "¡La suerte está rondando la casa en este momento!",
  "¡Qué partidazo nos estamos disfrutando todos!",
  "¡Aquí nadie se da por vencido hasta el último segundo!",
  "¡El suspenso está en su punto máximo!"
];

// 4. DICCIONARIO TRADICIONAL DE BINGO (Balotas Famosas)
export const TRADITIONAL_BINGO_JOKES = {
  1: "¡Arrancamos con el solterón y sin compromiso!",
  5: "¡Brincote de cinco!",
  7: "¡El número de la suerte de la casa!",
  11: "¡El par de muletas!",
  13: "¡Sin miedo al trece que trae la fortuna!",
  15: "¡La quinceañera, la niña bonita!",
  18: "¡La mayoría de edad celebrada!",
  22: "¡Los dos patitos nadando en el estanque!",
  25: "¡Las bodas de plata de la fiesta!",
  33: "¡La edad de Cristo sagrada!",
  44: "¡Los dos jorobados paseando!",
  50: "¡Las bodas de oro pura elegancia!",
  69: "¡El favorito de la casa de siempre!",
  75: "¡La balota cumbre de la fiesta total!"
};

/**
 * Obtiene una frase aleatoria de Presión al Líder
 */
export function getRandomLeaderPhrase(leaderName) {
  if (!leaderName) return "";
  const fn = LEADER_PRESSURE_BANK[Math.floor(Math.random() * LEADER_PRESSURE_BANK.length)];
  return fn(leaderName);
}

/**
 * Obtiene una frase aleatoria para el Colero (Underdog)
 */
export function getRandomUnderdogPhrase(underdogName) {
  if (!underdogName) return "";
  const fn = UNDERDOG_TEASING_BANK[Math.floor(Math.random() * UNDERDOG_TEASING_BANK.length)];
  return fn(underdogName);
}

/**
 * Obtiene una frase aleatoria de evento de juego
 */
export function getRandomEventPhrase() {
  return GAME_EVENT_BANK[Math.floor(Math.random() * GAME_EVENT_BANK.length)];
}

/**
 * Obtiene el dicho del número de Bingo si aplica
 */
export function getBingoNumberJoke(number) {
  return TRADITIONAL_BINGO_JOKES[Number(number)] || null;
}
