import * as cdk from '@aws-cdk/core';
import * as appsync from "@aws-cdk/aws-appsync"
import * as lambda from "@aws-cdk/aws-lambda"
import * as dynamoDb from "@aws-cdk/aws-dynamodb"
import * as subscriptions from "@aws-cdk/aws-sns-subscriptions"
import * as targets from "@aws-cdk/aws-events-targets"
import * as events from "@aws-cdk/aws-events"
import * as s3 from "@aws-cdk/aws-s3"
import * as cloudFront from "@aws-cdk/aws-cloudfront"
import * as origin from "@aws-cdk/aws-cloudfront-origins"
import * as s3deploy from "@aws-cdk/aws-s3-deployment"
import * as CodePipeline from '@aws-cdk/aws-codepipeline'
import * as CodePipelineAction from '@aws-cdk/aws-codepipeline-actions'
import * as CodeBuild from '@aws-cdk/aws-codebuild'
import * as iam from "@aws-cdk/aws-iam"


// export interface BackendStackProps extends cdk.StackProps{
//   readonly codePipeline: codePipeline.IPipeline
// }


export class BackendStack extends cdk.Stack {
  public readonly lambdaCode: lambda.CfnParametersCode
  constructor(app: cdk.App, id: string, props?: cdk.StackProps) {
    super(app, id, props);


    // The code that defines your stack goes here

    const API = new appsync.GraphqlApi(this, "API", {
      name: "cdk-virtual-lolly-appsync-eventBridge",
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),
      authorizationConfig: {
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

    new cdk.CfnOutput(this, "Graphql-API-URL", {
      value: API.graphqlUrl

    })

    new cdk.CfnOutput(this, "Graphql-API-KEY", {
      value: API.apiKey || ""

    })

    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region

    })

    //this.lambdaCode = lambda.Code.fromCfnParameters()

    this.lambdaCode = lambda.Code.fromCfnParameters()

    const virtualLollyLambda = new lambda.Function(this, "Virtual-lolly-lambda-function", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("functions"), //this.lambdaCode,
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


    const virtualLollyTable = new dynamoDb.Table(this, "Virtual-lolly-dynamoDb-table", {
      tableName: "lolliesTable",
      partitionKey: {
        name: "id",
        type: dynamoDb.AttributeType.STRING
      }

    })

    virtualLollyTable.grantFullAccess(virtualLollyLambda)

    virtualLollyLambda.addEnvironment("TABLE_NAME", virtualLollyTable.tableName)

    ///Allowing Lambda function to create events which will trigger codepipeline
    events.EventBus.grantAllPutEvents(virtualLollyLambda)

    const rule = new events.Rule(this, "LambdaEventBridgeVirtualLolly", {
      eventPattern: {
        source: ["lambda-events-codepipelineFE"]
      },

    })

    //Defining frontend deployment

    //deploy Gatsby on S3 bucket

    const gatsbyBucket = new s3.Bucket(this, "GatsbyBucket", {
      versioned: true,
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html'

    })

    // Create a CDN to deploy your website
    const distribution = new cloudFront.Distribution(this, "GatsbySiteDistribution", {
      defaultBehavior: {
        origin: new origin.S3Origin(gatsbyBucket)
      },
      defaultRootObject: 'index.html'

    })

    //printout out the web endpoint to the terminal

    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.domainName

    })

    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset("../frontend/gastbysite/public")],
      destinationBucket: gatsbyBucket,
      distribution: distribution,
      distributionPaths: ["/*"]

    })


    //Artifact of the source stage

    const sourceOuput = new CodePipeline.Artifact()

    // Artifact from build stage

    const s3Output = new CodePipeline.Artifact()

    //Code Build action

    const s3Build = new CodeBuild.PipelineProject(this, "s3Build", {
      buildSpec: CodeBuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            "runtime-versions": {
              "nodejs": 12
            },
            commands: [
              "cd frontend",
              "cd gastbysite",
              "npm i -g gatsby",
              "npm install"
            ],
          },
          build: {
            commands: [
              "gatsby build",
            ],
          },
        },
        artifacts: {
          "base-directory": "./frontend/gastbysite/public",
          "files": [
            '**/*'
          ]
        }
      }),
      environment: {
        buildImage: CodeBuild.LinuxBuildImage.STANDARD_3_0  ///BuildImage version 3 because we are using nodejs environment 12
      }
    })

    const policy = new iam.PolicyStatement();
    policy.addActions('s3:*'),
      policy.addResources('*'),

      s3Build.addToRolePolicy(policy)

    //Define a pipeline

    const pipeline = new CodePipeline.Pipeline(this, 'GatsbyPipeline', {
      crossAccountKeys: false,    //Pipeline construct creates an AWS Key Management Service (AWS KMS) which cost $1/month. this will save your $1.
      restartExecutionOnUpdate: true   //Indicates whether to rerun the AWS CodePipeline pipeline after you update it.

    })


    //First Stage Source

    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new CodePipelineAction.GitHubSourceAction({
          actionName: "Checkout",
          owner: "adeelmalik1988",
          repo: "eventbridge-awscdk-virtual-lolly-14C",
          oauthToken: cdk.SecretValue.plainText("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"),
          output: sourceOuput,
          branch: "main"
        })
      ]
    })

    ///Adding Build Stage
    pipeline.addStage({
      stageName: "Build",
      actions: [
        new CodePipelineAction.CodeBuildAction({
          actionName: "s3Build",
          project: s3Build,
          input: sourceOuput,
          outputs: [s3Output]
        })
      ]
    })

    //adding deploy stage

    pipeline.addStage({
      stageName: "Deploy",
      actions: [
        new CodePipelineAction.S3DeployAction({
          actionName: "DeployingGatsbySite",
          input: s3Output,
          bucket: gatsbyBucket,

        })
      ]
    })

    //Adding pipeline in the target

    rule.addTarget(new targets.CodePipeline(pipeline))


  }
}
