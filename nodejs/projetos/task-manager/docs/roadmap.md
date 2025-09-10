# 🛣️ Roteiro do Projeto: Gerenciador de Tarefas Assíncrono de Alta Performance

Este documento descreve as fases de desenvolvimento deste projeto, com o objetivo de construir um sistema robusto, resiliente e escalável, aplicando princípios essenciais de engenharia de software.

---

## 🎯 **Fase 1: Estabelecimento da Arquitetura Assíncrona**

O objetivo principal desta fase é projetar uma API que lide eficientemente com cargas de trabalho intensivas, sem comprometer a capacidade de resposta. A arquitetura será projetada para ser não-bloqueante, garantindo a alta disponibilidade do sistema.

- **Objetivos técnicos:** Implementar um endpoint `POST /tasks` com processamento de tarefas em background.
- **Tecnologias:** Node.js, Express e TypeScript para tipagem estática e manutenção do código.
- **Desafio de engenharia:** Garantir que o `Event Loop` do Node.js permaneça livre para aceitar novas requisições enquanto as tarefas pesadas são processadas em segundo plano. Utilizaremos um `EventEmitter` para desacoplar a ingestão da tarefa de sua execução.
- **Entregas:** Uma API com comportamento assíncrono e um endpoint `GET /tasks/:taskId` para consulta de status.

---

## 🛠️ **Fase 2: Fortalecimento da Resiliência e Escalabilidade**

Esta fase visa aprimorar a confiabilidade do sistema e sua capacidade de escalar horizontalmente. A dependência de componentes em memória será removida para garantir a persistência das tarefas e a distribuição da carga de trabalho.

- **Objetivos técnicos:**
  1.  Migrar a fila de tarefas de um `EventEmitter` para uma **fila persistente**, utilizando o **Redis** gerenciado pelo **BullMQ**.
  2.  Implementar uma arquitetura de "worker", onde um processo separado consome e executa as tarefas da fila, desacoplando a lógica de processamento da API de ingestão.
- **Tecnologias:** Redis, BullMQ.
- **Desafio de engenharia:** Configurar a tolerância a falhas, implementando um mecanismo de _retries_ no BullMQ para reprocessar tarefas que falharem, garantindo a robustez do sistema.
- **Entregas:** Uma arquitetura de microserviços simplificada com uma API e um worker dedicado, ambos integrados por uma fila persistente e resiliente.

---

## 🧠 **Fase 3: Otimização para Ambientes de Produção**

A fase final do projeto foca na implementação de práticas e padrões essenciais para a operação em ambientes de produção. O objetivo é garantir a segurança, performance e observabilidade do sistema.

- **Objetivos técnicos:**
  1.  **Rate Limiting:** Adicionar um middleware de controle de requisições para proteger a API contra uso excessivo e ataques de negação de serviço (DoS).
  2.  **Monitoramento:** Integrar um painel de monitoramento (provido pelo BullMQ) para obter visibilidade em tempo real sobre o estado das filas, o desempenho dos workers e o ciclo de vida das tarefas.
  3.  **Estratégia de Cache:** Implementar um sistema de cache no endpoint `GET /tasks/:taskId` usando o Redis. Resultados de tarefas concluídas serão armazenados para otimizar o tempo de resposta em consultas subsequentes.
- **Tecnologias:** Redis (para o cache), biblioteca de _rate limiting_.
- **Desafio de engenharia:** Definir uma estratégia de cache e uma política de expiração apropriadas para otimizar o desempenho sem comprometer a integridade dos dados.
- **Entregas:** Uma aplicação completa, com funcionalidades de segurança, performance otimizada e monitoramento, demonstrando um entendimento de sistemas prontos para produção.
