# Use Node 16 base image
FROM node:16-buster

# Create app directory
RUN mkdir /app
WORKDIR /app

# Copy package files and install 
COPY package.json ./
RUN npm install

# Copy all files
COPY . .

# Optional: Set your frontend URL
ENV NEXT_PUBLIC_APP_URL=https://sahayak.example.com

# Build the frontend
RUN npm run build

# Expose port Cloud Run listens on
EXPOSE 4000

# Start the app
CMD ["npm", "run", "start"]
