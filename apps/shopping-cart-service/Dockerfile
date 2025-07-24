# Usaremos este Dockerfile de estágio único para desenvolvimento
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Instala o pnpm globalmente ANTES de copiar os arquivos
# Isso otimiza o cache do Docker
RUN npm install -g pnpm

# Copia os arquivos de gerenciamento de pacotes
COPY package.json pnpm-lock.yaml ./

# Instala todas as dependências (incluindo as de dev)
RUN pnpm install

# Copia o resto do código-fonte
COPY . .

# Expõe a porta que o NestJS usa
EXPOSE 3000

# O comando do docker-compose.yml irá sobrescrever este CMD,
# mas é uma boa prática ter um comando padrão.
CMD ["pnpm", "run", "start:prod"]