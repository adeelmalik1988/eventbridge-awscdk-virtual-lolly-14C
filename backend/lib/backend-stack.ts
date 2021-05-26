import * as cdk from '@aws-cdk/core';
import * as appsync from "@aws-cdk/aws-appsync"
import * as lambda from "@aws-cdk/aws-lambda"
import * as dynamoDb from "@aws-cdk/aws-dynamodb"

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const API = new appsync.GraphqlApi(this,"API",{
      name: "cdk-virtual-lolly-appsync-eventBridge",
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),
      authorizationConfig:{
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        }
        
      },
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL

      },
      xrayEnabled: true
    })

    new cdk.CfnOutput(this,"Graphql-API-URL",{
      value: API.graphqlUrl

    })

    new cdk.CfnOutput(this,"Graphql-API-KEY",{
      value: API.apiKey || ""

    })

    new cdk.CfnOutput(this,"Stack Region",{
      value: this.region  

    })


    const virtualLollyLambda = new lambda.Function(this,"Virtual-lolly-lambda-function",{
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("functions"),
      handler: "main.handler",
    })

    const lambdaDs = API.addLambdaDataSource("lambdaDataSource", virtualLollyLambda)

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createLolly"
    })

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getLollyById"
    })

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listLollies"
    })


    const virtualLollyTable = new dynamoDb.Table(this,"Virtual-lolly-dynamoDb-table",{
      tableName: "lolliesTable",
      partitionKey: {
        name: "id",
        type: dynamoDb.AttributeType.STRING
      }

    })

    virtualLollyTable.grantFullAccess(virtualLollyLambda)

    virtualLollyLambda.addEnvironment("TABLE_NAME", virtualLollyTable.tableName )



  }
}
