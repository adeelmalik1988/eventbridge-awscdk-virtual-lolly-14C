import * as cdk from '@aws-cdk/core';
import * as appsync from "@aws-cdk/aws-appsync"
import * as lambda from "@aws-cdk/aws-lambda"
import * as dynamoDb from "@aws-cdk/aws-dynamodb"
import * as subscriptions from "@aws-cdk/aws-sns-subscriptions"
import * as targets from "@aws-cdk/aws-events-targets"
import * as events from "@aws-cdk/aws-events"
import { CodePipeline, LambdaFunction } from '@aws-cdk/aws-events-targets';

export class BackendStack extends cdk.Stack {
  public readonly lambdaCode: lambda.CfnParametersCode
  constructor(app: cdk.App, id: string, props?: cdk.StackProps) {
    super(app, id, props);

    
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
    
    //this.lambdaCode = lambda.Code.fromCfnParameters()

    this.lambdaCode = lambda.Code.fromCfnParameters()
    
    const virtualLollyLambda = new lambda.Function(this,"Virtual-lolly-lambda-function",{
        runtime: lambda.Runtime.NODEJS_12_X,
        code: this.lambdaCode, //lambda.Code.fromAsset("functions"),
        handler: "main.handler",
        description: `Function generated on: ${new Date().toISOString()}`
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

    ///Allowing Lambda function to create events which will trigger codepipeline
    events.EventBus.grantAllPutEvents(virtualLollyLambda) 

    const rule = new events.Rule(this,"LambdaEventBridgeVirtualLolly",{
      eventPattern: {
        source: ["lambda-events-codepipelineFE"]
      }

    })



  }
}
