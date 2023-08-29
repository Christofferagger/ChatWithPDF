# ChatWithPDF
Chat with one or multiple pdf files using any of OpenAI models! **28 times cheaper** than using python and Streamlit 👀

Demo: ...

Tweet: ...

## Set it up
**1.** Clone the repository
```
git clone https://github.com/Christofferagger/CWP.git
```

**2.** Install all the requirements in the server file
```
cd server
```
```
pip install -r requirements.txt
```

**3.** Rename the .env.example file by executing the following command
```
mv .env.example .env
```

**4.** Insert your OpenAI API key in the re-named .env file
```
Replace "Your-OpenAI-Key-Here" with your API key in the new .env file
```

**5.** Start your local server. Perform in the terminal
```
cd server
```
```
node server.js
```

**6.** Run your react app
```
cd ..
```
```
cd client
```
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

Enjoy❄️
