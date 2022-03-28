FROM node:16.14

# Create directories
RUN mkdir -p /eleos/blockchain/ && mkdir -p /eleos/backend/
WORKDIR /eleos/

# Layer caching
COPY ./backend/package.json backend/package.json
RUN cd backend && npm install --production

# Copy the rest of the files over
COPY ./backend/ backend/

# Install wait-for-it
RUN wget https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && chmod +x wait-for-it.sh

CMD ./wait-for-it.sh database:27017 && \
    cd backend && npm start