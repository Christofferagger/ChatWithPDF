# ChatWithPDF
Chat with one or multiple pdf files using any of OpenAI models! **12 times cheaper** than using python and Streamlit 👀

## Demo


https://github.com/Christofferagger/CWP/assets/88538278/19e6cdae-4069-48d7-8361-3ae303ae8148



## Tweet

...

## Set it up
### 1. Clone the repository
```
git clone https://github.com/Christofferagger/CWP.git
```

### 2. Rename the .env.example file by running the following command in the terminal
```
mv .env.example .env
```

### 3. Insert your OpenAI API key in the re-named .env file
```
Replace "Your-OpenAI-Key-Here" with your API key in the new .env file
```

### 3. Navigate to the server folder in the terminal
```
cd server
```

### 4. Install all required Node.js packages
```
npm install
```

### 5. Start your local server by running the following command in the terminal
```
node server.js
```

### 6. Navigate to the client folder in the terminal
```
cd ..
```
```
cd client
```

### 7. Run the react app
```
npm start
```

Bam you got it!

## Switch OpenAI model
If you want to use another OpenAI model, head to server.js in the server folder. Then find the modelName property in the model variable. Here you can change your model to whatever you prefer! 
Here is the code you should look for. 
```
const model = new ChatOpenAI({ 
            modelName: "gpt-3.5-turbo-16k",
            ...
```
