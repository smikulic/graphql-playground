// require express
const express = require('express');
const app = express();

// require graphql
const {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} = require('graphql');
const graphqlHTTP = require('express-graphql');

// require postgres
const pg = require('pg');
const pgpool = new pg.Pool({ database: 'graphql_demo' });

// set up schema
const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLID },
    email: { type: GraphQLString },
  }
});

const commentType = new GraphQLObjectType({
  name: 'Comment',
  fields: {
    id: { type: GraphQLID },
    post_id: { type: GraphQLInt },
    text: { type: GraphQLString },
    user: {
      type: userType,
      resolve: (obj) => {
        return pgpool.query(`
          SELECT * FROM users
          WHERE id = $1
        `, [obj.user_id]).then((result) => result.rows[0]);
      }
    },
  }
});

const postType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    comments: {
      type: new GraphQLList(commentType),
      args: {
        limit: {
          type: GraphQLInt
        }
      },
      resolve: (obj, args) => {
        return pgpool.query(`
          SELECT * FROM comments
          WHERE post_id = $1
          LIMIT $2
        `, [obj.id, args.limit]).then((result) => result.rows);
      }
    },
  }
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      post: {
        type: postType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve: (obj, args) => {
          return pgpool.query(`
            SELECT * FROM posts
            WHERE id = $1
          `, [args.id]).then((result) => result.rows[0]);
        }
      },
      posts: {
        type: new GraphQLList(postType),
        resolve: () => {
          return pgpool.query(`
            SELECT * FROM posts
          `, []).then((result) => result.rows);
        }
      },
    },
  }),
});

// set up graphQL playground
app.use('/playground', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

app.listen(4000, () => {
  console.log('Server is running on localhost:4000 ...');
});