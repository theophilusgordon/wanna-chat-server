import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import userSchema from "./schema/userSchema";
import messageSchema from "./schema/messageSchema";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/graphql/:endpoint", (req, res) => {
    let schema;

    switch (req.params.endpoint) {
        case "user":
            schema = userSchema;
            break;
        case "message":
            schema = messageSchema;
            break;
        default:
            return;
    }

    graphqlHTTP({
        schema,
        graphiql: process.env.NODE_ENV === "development",
        context: { req },
    })(req, res);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`));

export default app;
