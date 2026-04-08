FROM cypress/included:13.15.2

WORKDIR /e2e/cypress

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["cypress", "run"]