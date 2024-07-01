const Origin = (name, canEmitTo) => ({
  name,
  canEmitTo,
  events: {},
});

const AvailableOrigins = {
  Joker: Origin("Joker", ["Acelera"]),
  Acelera: Origin("Acelera", ["Joker"]),
};

const Event = (name, origin, data) => ({
  name,
  origin,
  data,
});

const EventBus = (availableOrigins) => {
  const origins = { ...availableOrigins };

  return {
    on: (origin, eventName, fn) => {
      if (!origins[origin]) {
        console.error(`Origin ${origin} not found.`);
        return;
      }

      if (!origins[origin].events[eventName]) {
        origins[origin].events[eventName] = [];
      }

      origins[origin].events[eventName].push(fn);
    },
    emit: (origin, eventName, data) => {
      if (!origins[origin]) {
        console.error(`Origin ${origin} not found.`);
        return;
      }

      const event = Event(eventName, origin, data);
      const emittedOrigins = new Set();

      const emitToOrigin = (targetOrigin) => {
        if (
          origins[targetOrigin] &&
          origins[targetOrigin].events[eventName] &&
          !emittedOrigins.has(targetOrigin)
        ) {
          emittedOrigins.add(targetOrigin);
          origins[targetOrigin].events[eventName].forEach((fn) => fn(event));
        }
      };

      // Emitir evento para a própria origem
      emitToOrigin(origin);

      // Emitir evento para origens permitidas
      origins[origin].canEmitTo.forEach(emitToOrigin);
    },
  };
};

// Inicializando EventBus com origens disponíveis
const eventBus = EventBus(AvailableOrigins);

// Função para envio de proposta por email
const sendPropostaByEmail = async (event) => {
  const repositories = {
    Joker: "Enviando proposta ao Joker",
    Acelera: "Enviando proposta ao Acelera",
  };

  setTimeout(() => {
    console.log(repositories[event.origin], event.data);
  }, 2000);
};

// Gerenciamento de sessões
const GenerateToken = () => Math.random().toString(36).substring(7);

const User = (name) => ({ name });

const SessionManager = () => {
  const sessions = {};

  return {
    getSession: (token) => sessions[token],
    getToken: (user) => {
      const token = GenerateToken();
      sessions[token] = user;
      return token;
    },
  };
};

const sessionManager = SessionManager();

// API Gateway para validação de tokens
const APIGateway = (sessionManager) => ({
  validateToken: (token) => sessionManager.getSession(token),
});

// Serviços para envio de propostas
const Service = (originName, apiGateway) => ({
  enviarProposta: (token, proposta) => {
    const user = apiGateway.validateToken(token);
    if (!user) {
      console.error("Usuário não autenticado.");
      return;
    }

    eventBus.emit(originName, "enviarProposta", proposta);
  },
});

// Inicializando serviços
const apiGateway = APIGateway(sessionManager);
const serviceAcelera = Service("Acelera", apiGateway);
const serviceJoker = Service("Joker", apiGateway);

// Registrando handlers
eventBus.on("Acelera", "enviarProposta", sendPropostaByEmail);
eventBus.on("Joker", "enviarProposta", sendPropostaByEmail);

// Simulando chamadas de API
const userAcelera = User("Acelera");
const tokenAcelera = sessionManager.getToken(userAcelera);
serviceAcelera.enviarProposta(tokenAcelera, {
  razaoSocial: "Acelera",
  cnpj: "123456789",
});

const userJoker = User("Joker");
const tokenJoker = sessionManager.getToken(userJoker);
serviceJoker.enviarProposta(tokenJoker, {
  razaoSocial: "Joker",
  cnpj: "987654321",
});
