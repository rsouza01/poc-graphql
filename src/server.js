var express = require('express');
const { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

var coursesData = require('./coursesData.json');

var schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    },
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);


var getCourse = function(args) {
    var id = args.id;
    return coursesData.filter(course => {
        return course.id === id;
    })[0];
}

var getCourses = function(args) {
    if (args.topic) {
        var topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

var root = {
    course: getCourse,
    courses: getCourses
};

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema, 
    rootValue: root, 
    graphiql: true
}));

app.listen(4000, () => console.log('Express GraphQL server now running on localhost:4000/graphql'));