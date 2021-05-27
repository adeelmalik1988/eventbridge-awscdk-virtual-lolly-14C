import * as cdk from '@aws-cdk/core';
import * as lambda from "@aws-cdk/aws-lambda"
import * as CodePipeline from "@aws-cdk/aws-codepipeline"
import * as CodeBuild from "@aws-cdk/aws-codebuild"
import * as CodePipelineAction from "@aws-cdk/aws-codepipeline-actions"

export interface BackendPipelineStackProps extends cdk.StackProps{
    readonly lambdaCode: lambda.CfnParametersCode;
}

export class BackendPipelineStack extends cdk.Stack {
    
  constructor(app: cdk.App, id: string, props?: BackendPipelineStackProps) {
    super(app, id, props);

    // The code that defines your stack goes here

    const stackName = "BackendStack"

    ///Artifact from source stage
    const sourceOutput = new CodePipeline.Artifact();

    //Artifact from build stage
    const CDKOutput = new CodePipeline.Artifact();

    const lambdaBuildOutput = new CodePipeline.Artifact()

    //Code for lambda build

    const lambdaBuild = new CodeBuild.PipelineProject(this,"lambdaBuild",{
      buildSpec: CodeBuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          install: {
            commands: [
              "cd backend",
              "cd functions",
              "npm install",
          ],
          },
            build: {
              commands: "npm run build",
            },
        },
        artifacts: {
          "base-directory": "./backend/functions",
          files: [
            "**/*",
            "*",
          ]
        },
      }),
      environment: {
          buildImage: CodeBuild.LinuxBuildImage.STANDARD_3_0
      }

    })

    //Code build action, complete build will be define here

    const cdkBuild = new CodeBuild.PipelineProject(this, "cdkBuild", {
      buildSpec: CodeBuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          install: {
            "runtime-versions": {
              "nodejs": 12
            },
            commands: [
              "cd backend",
              "npm install"
            ],      
          },
          build: {
            commands: [
              "npm run build",
              "npm run cdk synth -- -o dist"
            ],
          },
        },
        artifacts: {
          "base-directory": "./backend/dist",
          files: [
            `${stackName}.template.json`,
          ],
        }

      }),
      environment: {
        buildImage: CodeBuild.LinuxBuildImage.STANDARD_3_0  ///BuildImage version 3 because we are using nodejs environment 12
      }
    })

    //Define a pipeline
    const pipeline = new CodePipeline.Pipeline(this,"CDKPipeline",{
      crossAccountKeys: false,  //Pipeline construct creates an AWS Key Management Service (AWS KMS) which cost $1/month. this will save your $1
      restartExecutionOnUpdate: true
    })

    //Adding stages to pipeline

    pipeline.addStage({
      stageName: "Source",
      actions: [
        new CodePipelineAction.GitHubSourceAction({
            actionName: 'Checkout',
            owner: 'adeelmalik1988',
            repo: 'eventbridge-awscdk-virtual-lolly-14C',
            oauthToken: cdk.SecretValue.plainText("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"), ///create token on github and save it on aws secret manager
            output: sourceOutput,   //Output will save in the sourceOutput Artifact
            branch: "main",
        })
      ]
    })

    pipeline.addStage({
      stageName: "Build",
      actions: [ 
          new CodePipelineAction.CodeBuildAction({
            actionName: "lambdaBuild",
            project: lambdaBuild,
            input: sourceOutput,
            outputs: [lambdaBuildOutput]
          }),
          new CodePipelineAction.CodeBuildAction({
          actionName: "cdkBuild",
          project: cdkBuild,
          input: sourceOutput,
          outputs: [CDKOutput]
        })
      ]

    })

    pipeline.addStage({
      stageName: "DeployCDK",
      actions: [
        new CodePipelineAction.CloudFormationCreateUpdateStackAction({
          actionName: "AdministerPipeline",
          templatePath: CDKOutput.atPath(`${stackName}.template.json`), ///Input artifact with the CloudFormation template to deploy
          stackName: stackName,
          adminPermissions: true,
          parameterOverrides: {
              ...props?.lambdaCode.assign(lambdaBuildOutput.s3Location)
          },
          
          extraInputs: [lambdaBuildOutput]

        })
      ]
    })


  }
}
