FROM node:16.14

# Create directories
RUN mkdir -p /eleos/frontend/ && mkdir -p /eleos/frontend/
WORKDIR /eleos/

# Layer caching
COPY ./frontend/package.json frontend/package.json
RUN cd frontend && npm install --legacy-peer-deps

# Copy the rest of the files over
COPY ./frontend/ frontend/

# Install wait-for-it
RUN wget https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && chmod +x wait-for-it.sh

CMD ./wait-for-it.sh backend:8080 && \
    cd frontend && npm run build && npm run start