import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import {graphqlHTTP} from "express-graphql"
import schema from "./schema/userSchema";
import routes from "./routes/routes";

const app = express();

app.use(express.json());
app.use(cors());

app.use('/graphql', graphqlHTTP({
		  schema,
		  graphiql: process.env.NODE_ENV === 'development'
}))
app.use("/api/v1/", routes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`));

export default app;
