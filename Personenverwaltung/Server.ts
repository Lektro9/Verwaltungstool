import App from "./App";

const port = parseInt(process.env.PORT || "3004");

const server = new App()
  .StartServer(port)
  .then((port) => console.log(`Server running on port ${port}`))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

export default server;
