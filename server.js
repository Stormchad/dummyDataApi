const express = require('express')

const { graphqlHTTP } = require('express-graphql');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
  } = require('graphql')



const dummyData = [
    {id: 1,text: 'this is dummy data 1'},
    {id: 2,text: 'this is dummy data 2'},
    {id: 3,text: 'this is dummy data 3'},
    {id: 4,text: 'this is dummy data 4'},
    {id: 5,text: 'this is dummy data 5'},
    {id: 6,text: 'this is dummy data 6'},
    {id: 7,text: 'this is dummy data 7'},
    {id: 8,text: 'this is dummy data 8'},
    {id: 9,text: 'this is dummy data 9'},
    {id: 10,text: 'this is dummy data 10'},
    {id: 11,text: 'this is dummy data 11'},
]

const app = express()



const listViewer = new GraphQLObjectType({
    name: 'list',
    description: 'this is represents a list',
    fields:()=>({

        id:{type: GraphQLNonNull(GraphQLInt)},
        text:{type:GraphQLNonNull(GraphQLString)}

    })
})


const rootQueryType = new GraphQLObjectType({

    name: 'query',
    description: 'this is used to get/query data',
    fields: ()=>({

        allData:{

            type: new GraphQLList(listViewer),
            description: 'This will get all the dummy data',
            resolve:()=>dummyData
            },

            getDataById:{   
                type: listViewer,
                description: 'This will get specific dummy data',
                args:{
                    id:{type: GraphQLInt}
                },
                resolve:(parent, args) => dummyData.find(dummyData => args.id === dummyData.id)
                }

        })
    
    })

 const rootMutationType = new GraphQLObjectType({

     name: 'mutation',
     description:'this is used to post/update/delete data',
     fields: ()=>({

         addData:{
             type: listViewer,
             description: 'This will add data',

             args:{

                 text:{type: GraphQLNonNull(GraphQLString)}

             },

             resolve:(parent, args)=>{

                 const data = {id: dummyData.length + 1, text: args.text}
                 dummyData.push(data)
                 return data
             }

         },
         updateData:{
            type:listViewer,
            description:'this will update data based on id',
            args:{
                id:{type: GraphQLNonNull(GraphQLInt)},
                updatedText:{type:GraphQLNonNull(GraphQLString)}
            },
            resolve:(parent,args)=>{

                const dataToBeUpdated = dummyData.find(dummyData =>dummyData.id === args.id)
                dataToBeUpdated.text = args.updatedText
                return dataToBeUpdated
            }
         },
         
         deleteData:{
            type:GraphQLList(listViewer),
            description:'this will delete data based on id',
            args:{
                id:{type: GraphQLNonNull(GraphQLInt)}
            },
            resolve:(parents,args) => {

                delete dummyData[args.id - 1]
                delete dummyData[args.id - 1]
                return dummyData
            }
         }
        

     })
})


const schema = new GraphQLSchema({

    query: rootQueryType,
    mutation: rootMutationType

})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
  }))

const portNumber = 5000

app.listen(portNumber, ()=>{

    console.log('server is running on port: ', portNumber)

})