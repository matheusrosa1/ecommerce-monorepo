# Usaremos este Dockerfile de estágio único para desenvolvimento
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Ativa uma versão fixa do pnpm para manter builds reproduzíveis.
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

# Copia os arquivos de gerenciamento de pacotes
COPY package.json pnpm-lock.yaml ./

# Instala exatamente as dependências registradas no lockfile.
RUN pnpm install --frozen-lockfile

# Copia o resto do código-fonte
COPY . .

# Expõe a porta que o NestJS usa
EXPOSE 3000

# O comando do docker-compose.yml irá sobrescrever este CMD,
# mas é uma boa prática ter um comando padrão.
CMD ["pnpm", "run", "start:prod"]
