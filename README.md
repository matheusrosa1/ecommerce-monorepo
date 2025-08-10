# E-commerce Monorepo com NestJS e Microsserviços

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Language](https://img.shields.io/badge/language-TypeScript-blue)
![Framework](https://img.shields.io/badge/framework-NestJS-red)
![Containerization](https://img.shields.io/badge/container-Docker-blue)
![Database](https://img.shields.io/badge/database-PostgreSQL%20%7C%20Redis-green)
![Messaging](https://img.shields.io/badge/messaging-RabbitMQ-orange)

> **⚠️ Projeto em Andamento!**
> Este projeto está sendo desenvolvido ativamente. As funcionalidades atuais estão estáveis, mas novos microsserviços e melhorias na arquitetura serão adicionados continuamente.

## 📖 Sobre o Projeto

Este repositório contém o backend de uma plataforma de e-commerce moderna, construída utilizando uma **arquitetura de microsserviços**. O objetivo é criar um sistema robusto, escalável e de fácil manutenção, onde cada responsabilidade de negócio é isolada em um serviço independente.

Este projeto serve como um estudo de caso prático e um portfólio demonstrando a aplicação de tecnologias e padrões de arquitetura de software de mercado para soluções de e-commerce.

## 🏛️ Arquitetura

A arquitetura do sistema é baseada em microsserviços que se comunicam de forma síncrona (via API REST) e assíncrona (via mensageria com RabbitMQ). Um API Gateway (a ser implementado) atuará como a única porta de entrada para as requisições do cliente.

```
[ Cliente (Frontend) ]
         |
         v
[ API Gateway ]
         |
         +--------------------------------+------------------------------+
         | (REST)                         | (REST)                       | (REST)
         v                                v                              v
[ Product Catalog Service ] <--> [ Shopping Cart Service ]      [ Payment Service ]
         |                                |                              |
         v                                v                              v
  [ PostgreSQL ]                       [ Redis ]                   [ PostgreSQL ]
         ^                                                              |
         |                                                              |
         +--------------------<[ RabbitMQ (Event Bus) ]<----------------+
                            (Consome eventos de pagamento)
```

## ✨ Tecnologias Utilizadas

A pilha de tecnologia foi escolhida para garantir performance, escalabilidade e uma ótima experiência de desenvolvimento.

* **Backend:**
    * [NestJS](https://nestjs.com/) (Framework Node.js)
    * [TypeScript](https://www.typescriptlang.org/)
* **Bancos de Dados & Cache:**
    * [PostgreSQL](https://www.postgresql.org/): Para dados persistentes e relacionais (Produtos, Pagamentos).
    * [Redis](https://redis.io/): Para dados voláteis e de acesso rápido (Carrinho de Compras).
    * [TypeORM](https://typeorm.io/): ORM para interação com o banco de dados.
* **Mensageria (Comunicação Assíncrona):**
    * [RabbitMQ](https://www.rabbitmq.com/): Para a troca de eventos entre microsserviços.
* **Containerização:**
    * [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/): Para criar e orquestrar o ambiente de desenvolvimento.

## ✅ Funcionalidades

### Implementado

* **Microsserviço de Catálogo de Produtos (`product-catalog-service`)**
    * CRUD completo para Produtos e Categorias.
    * Sistema de upload de imagens desacoplado (salvando localmente).
    * Endpoint para busca de múltiplos produtos em lote (`/batch`).
* **Microsserviço de Carrinho de Compras (`shopping-cart-service`)**
    * Adicionar itens ao carrinho.
    * Consultar o estado do carrinho.
    * Limpar o carrinho.
    * Comunicação síncrona com o serviço de catálogo para enriquecer os dados do carrinho com nome e preço, e calcular o total.

### Em Desenvolvimento

* **Microsserviço de Pagamentos (`payment-service`)**
    * Recebimento de requisições de pagamento.
    * Simulação de processamento com gateway externo.
    * Publicação de eventos (`PAGAMENTO_APROVADO`, `PAGAMENTO_RECUSADO`) no RabbitMQ.

## 🚀 Como Executar o Projeto

Para executar o ambiente de desenvolvimento localmente, você precisará ter o Docker e o Docker Compose instalados.

1.  **Clone o repositório:**
    ```bash
    git clone git@github.com:matheusrosa1/ecommerce-monorepo.git
    cd e-commerce-monorepo
    ```

2.  **Crie o arquivo de variáveis de ambiente:**
    Crie uma cópia do arquivo `.env.example` (que você deve criar) e renomeie para `.env`. Preencha com as suas credenciais.

    _Exemplo de `.env`:_
    ```env
    # Portas
    POSTGRES_PORT=5432
    REDIS_PORT=6379
    RABBITMQ_PORT=5672
    RABBITMQ_MANAGE_PORT=15672

    # Credenciais do Banco de Dados
    POSTGRES_USER=docker
    POSTGRES_PASSWORD=docker
    POSTGRES_DB=ecommerce_db
    ```

3.  **Suba os containers:**
    Execute o comando a seguir na raiz do projeto. Ele irá construir as imagens de cada microsserviço e iniciar todos os containers.

    ```bash
    docker-compose up --build
    ```

4.  **Acesse os serviços:**
    * **Catálogo de Produtos:** `http://localhost:3000`
    * **Carrinho de Compras:** `http://localhost:3001`
    * **Pagamentos:** `http://localhost:3002`
    * **RabbitMQ Management:** `http://localhost:15672` (usuário: `guest`, senha: `guest`)

## 🗺️ Roadmap Futuro

* [ ] Implementar o **Microsserviço de Autenticação** (JWT).
* [ ] Implementar um **API Gateway** com NestJS para ser o ponto de entrada único.
* [ ] Implementar um **Microsserviço de Notificações** que consome eventos do RabbitMQ para enviar e-mails.
* [ ] Criar um **Microsserviço de Pedidos** que consolida as informações do carrinho após um pagamento aprovado.
* [ ] Adicionar testes unitários e de integração.
