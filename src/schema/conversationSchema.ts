import prisma from "../config/prisma";
import {
    GraphQLID,
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} from "graphql";
import { UserType } from "./userSchema";
import { MessageType } from "./messageSchema";

const ConversationType = new GraphQLObjectType({
    name: "Conversation",
    fields: () => ({
        id: { type: GraphQLID },
        participants: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return prisma.conversation
                    .findUnique({
                        where: {
                            id: parent.id,
                        },
                    })
                    .participants();
            },
        },
        messages: {
            type: new GraphQLList(MessageType),
            resolve(parent, args) {
                return prisma.conversation
                    .findUnique({
                        where: {
                            id: parent.id,
                        },
                    })
                    .messages();
            },
        },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        conversations: {
            type: ConversationType,
            resolve(parent, args) {
                return prisma.conversation.findMany();
            },
        },
        conversation: {
            type: ConversationType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return prisma.conversation.findUnique({
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
        addConversation: {
            type: ConversationType,
            args: {
                text: { type: GraphQLString },
                senderId: { type: GraphQLID },
            },
            resolve(parent, args) {
                return prisma.conversation.create({
                    data: {
                        participants: args.participants,
                        messages: args.messages,
                    },
                });
            },
        },
        updateMessage: {
            type: ConversationType,
            args: {
                id: { type: GraphQLID },
                text: { type: GraphQLString },
            },
            resolve(parent, args) {
                return prisma.conversation.update({
                    where: {
                        id: args.id,
                    },
                    data: {
                        participants: args.participants,
                        messages: args.messages,
                    },
                });
            },
        },
        deleteMessage: {
            type: ConversationType,
            args: {
                id: { type: GraphQLID },
            },
            resolve(parent, args) {
                return prisma.conversation.delete({
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
