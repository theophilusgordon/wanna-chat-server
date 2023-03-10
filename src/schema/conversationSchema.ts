import prisma from "../config/prisma";
import { GraphQLID, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

const ConversationType = new GraphQLObjectType({
	name: 'Conversation',
	fields: () => ({
		id: { type: GraphQLID },
		text: { type: GraphQLString },
		senderId: { type: GraphQLID },
	}),
})

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
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
	name: 'Mutation',
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
						text: args.text,
						senderId: args.senderId,
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
						text: args.text,
					},
				});
			}
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
			}
		}
	},
});

export default new GraphQLSchema({
	query: RootQuery,
	mutation,
});