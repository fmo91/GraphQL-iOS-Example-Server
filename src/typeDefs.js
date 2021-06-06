const { gql } = require('apollo-server');

const typeDefs = gql`
	type Task {
		id: ID!
		title: String!
		content: String!
		completed: Boolean!
	}

	type Project {
		id: ID!
		title: String!
		tasks: [Task!]!
	}

	input CreateProjectInput {
		title: String!
	}

	input CreateTaskInput {
		projectId: ID!
		title: String!
		content: String!
	}

	input EditTaskInput {
		projectId: ID!
		taskId: ID!
		title: String
		content: String
		completed: Boolean
	}

	type Query {
		projects: [Project!]!
		project(id: ID!): Project
	}

	type Mutation {
		createProject(data: CreateProjectInput!): Project!
		createTask(data: CreateTaskInput!): Task!
		editTask(data: EditTaskInput!): Task!
	}
`;

module.exports = typeDefs;