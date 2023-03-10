import prisma from "../config/prisma";
import hashPassword from "../utils/hashPassword";
import {
	GraphQLError,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} from "graphql";
import { getUserByIdValidation } from "../validations/userValidations";

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        username: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        otherNames: { type: GraphQLString },
        profilePicture: { type: GraphQLString },
        avatar: { type: GraphQLString },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return prisma.user.findMany();
            },
        },
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
				const {error} = getUserByIdValidation.validate(args)
				if (error) {
					throw new GraphQLError(error.message);
				}
				
                return prisma.user.findUnique({
                    where: {
                        id: args.id,
                    },
                });
            },
        },
    },
});

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addUser: {
            type: UserType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLString },
                username: { type: GraphQLString },
                password: { type: GraphQLString },
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                otherNames: { type: GraphQLString },
                profilePicture: { type: GraphQLString },
                avatar: { type: GraphQLString },
            },
            async resolve(parent, args) {
                const hashedPassword = await hashPassword(args.password);
                const user = await prisma.user.create({
                    data: {
                        email: args.email,
                        phone: args.phone,
                        username: args.username,
                        password: hashedPassword,
                        firstName: args.firstName,
                        lastName: args.lastName,
                        otherNames: args.otherNames,
                        profilePicture: args.profilePicture,
                        avatar: args.avatar,
                    },
                });
                return user;
            },
        },
        updateUser: {
            type: UserType,
            args: {
                id: { type: GraphQLID },
                phone: { type: GraphQLString },
                username: { type: GraphQLString },
                password: { type: GraphQLString },
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                otherNames: { type: GraphQLString },
                profilePicture: { type: GraphQLString },
                avatar: { type: GraphQLString },
            },
            async resolve(parent, args) {
				let hashedPassword;
                if (args.password) {
                    hashedPassword = await hashPassword(args.password);
                }
                const updatedUser = await prisma.user.update({
                    where: {
                        id: args.id,
                    },
                    data: {
                        email: args.email,
                        phone: args.phone,
                        username: args.username,
                        password: hashedPassword,
                        firstName: args.firstName,
                        lastName: args.lastName,
                        otherNames: args.otherNames,
                        profilePicture: args.profilePicture,
                        avatar: args.avatar,
                    },
                });
                return updatedUser;
            },
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: GraphQLID },
            },
            resolve(parent, args) {
                return prisma.user.delete({
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
    mutation,
});
