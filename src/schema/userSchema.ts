import prisma from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/password";
import {
    GraphQLError,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} from "graphql";
import UserErrorMessages from "../constants/userErrorMessages";

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
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
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
        loginUser: {
            type: UserType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
                const user = await prisma.user.findUnique({
                    where: {
                        email: args.email,
                    },
                });
                if (!user) {
                    throw new GraphQLError(
                        UserErrorMessages.invalidCredentials()
                    );
                }
                const isPasswordValid = await comparePassword(
                    args.password,
                    user.password
                );
                if (!isPasswordValid) {
                    throw new GraphQLError(
                        UserErrorMessages.invalidCredentials()
                    );
                }
                return user;
            },
        },
        updateUser: {
            type: UserType,
            args: {
                id: { type: GraphQLID },
                email: { type: GraphQLString },
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

                const userExists = await prisma.user.findUnique({
                    where: {
                        email: args.email,
                    },
                });

                if (!userExists) {
                    throw new GraphQLError(
                        UserErrorMessages.notUser()
                    );
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

export {
	UserType,
}
