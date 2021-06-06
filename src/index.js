const { ApolloServer } = require('apollo-server');
const typeDefs = require('./typeDefs');

let projects = [];
let lastProjectId = 1;
let lastTaskId = 1;

const resolvers = {
	Query: {
		projects: () => projects,
		project: (_, { id }) => {
			return projects
				.find(project => project.id === id);
		},
	},
	Mutation: {
		createProject: (_, { data }) => {
			const newProject = {
				id: lastProjectId.toString(),
				title: data.title,
				tasks: [],
			}
			lastProjectId++;
			projects.push(newProject);
			return newProject;
		},
		createTask: (_, { data }) => {
			const newTask = {
				id: lastTaskId.toString(),
				title: data.title,
				content: data.content,
				completed: false,
			};
			lastTaskId++;
			projects = projects
				.map(project => project.id === data.projectId ? { ...project, tasks: [...project.tasks, newTask] } : project);
			return newTask;
		},
		editTask: (_, { data }) => {
			projects = projects
				.map(project => {
					if (project.id === data.projectId) {
						return {
							...project,
							tasks: project.tasks.map(task => {
								if (task.id === data.taskId) {
									return {
										...task,
										title: data.title || task.title,
										content: data.content || task.content,
										completed: data.completed === undefined ? task.completed : data.completed,
									};
								} else {
									return task;
								}
							})
						};
					} else {
						return project;
					}
				});
			const project = projects.find(project => project.id === data.projectId);
			return project.tasks.find(task => task.id === data.taskId);
		}
	}
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});