FROM node:16.14

# Create directories
RUN mkdir -p /eleos/blockchain/ && mkdir -p /eleos/backend/
WORKDIR /eleos/

# Layer caching
COPY blockchain/package.json blockchain/package.json
RUN cd blockchain && npm install --production --legacy-peer-deps

# Layer caching
COPY backend/package.json backend/package.json
RUN cd backend && npm install --production

# Copy the rest of the files over
COPY ./blockchain blockchain/
COPY ./backend/ backend/

# Install wait-for-it
RUN wget https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && chmod +x wait-for-it.sh

CMD ./wait-for-it.sh blockchain:8545 -t 60 -- \
    ./wait-for-it.sh database:27017 -t 60 && \
    cd blockchain && npx truffle compile && npx truffle migrate && \
    cd ../backend && node campaignListener/listener.js