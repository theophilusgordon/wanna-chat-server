import prisma from "../config/prisma";
import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} from "graphql";

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        password: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        otherNames: { type: GraphQLString },
        avatar: { type: GraphQLString },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return prisma.user.findUnique({
                    where: {
                        id: args.id,
                    },
                });
            },
        },
    },
});

export default new GraphQLSchema({
    query: RootQuery,
});
