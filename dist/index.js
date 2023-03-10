"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_graphql_1 = require("express-graphql");
const routes_1 = __importDefault(require("./routes/routes"));
const schema_prisma_1 = __importDefault(require("../prisma/schema.prisma"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({
    schema: schema_prisma_1.default,
    graphiql: process.env.NODE_ENV === 'development'
}));
app.use("/api/v1/", routes_1.default);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`));
exports.default = app;
//# sourceMappingURL=index.js.map