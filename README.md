# ChatWithPDF 📄🚀
Chat with one or multiple pdf files using any of OpenAI models! **12 times cheaper** than using python and Streamlit 👀

## Demo 👀
https://github.com/Christofferagger/ChatWithPDF/assets/88538278/c137613b-f43a-491b-9189-8cf067dcb71c


## Tweet 🐔
https://twitter.com/C_Agger_/status/1696797024652288309?s=20

## Set it up 🤯
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

## Switch OpenAI model 🤖
If you want to use another OpenAI model, head to server.js in the server folder. Then find the modelName property in the model variable. Here you can change your model to whatever you prefer! 
Here is the code you should look for. 
```
const model = new ChatOpenAI({ 
            modelName: "gpt-3.5-turbo-16k",
            ...
```

# Let's connect 🤘
I need friends - Catch me on Twitter [c_Agger_](https://twitter.com/C_Agger_)
