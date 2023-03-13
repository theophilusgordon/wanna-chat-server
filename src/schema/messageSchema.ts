import {
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} from "graphql";
import prisma from "../config/prisma";

const MessageType = new GraphQLObjectType({
    name: "Message",
    fields: () => ({
        id: { type: GraphQLID },
        text: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
        userId: { type: GraphQLID },
        chatId: { type: GraphQLID },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        messages: {
            type: new GraphQLList(MessageType),
            resolve(parent, args) {
                return prisma.message.findMany();
            },
        },
        message: {
            type: MessageType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return prisma.message.findUnique({
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
        addMessage: {
            type: MessageType,
            args: {
                text: { type: new GraphQLNonNull(GraphQLString) },
                senderId: { type: new GraphQLNonNull(GraphQLID) },
                conversationId: { type: GraphQLID },
                chatRoomId: { type: GraphQLID },
            },
            resolve(parent, args) {
                return prisma.message.create({
                    data: {
                        text: args.message,
                        senderId: args.userId,
                        conversationId: args.chatId,
                        chatRoomId: args.ChatRoomId,
                    },
                });
            },
        },
        updateMessage: {
            type: MessageType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                text: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                return prisma.message.update({
                    where: {
                        id: args.id,
                    },
                    data: {
                        text: args.text,
                    },
                });
            },
        },
        deleteMessage: {
            type: MessageType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return prisma.message.delete({
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
	MessageType,
}
