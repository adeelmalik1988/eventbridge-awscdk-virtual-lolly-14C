
# Virtual Lolly

- Backend Stack is deployed by using AWS CDK on Amazon Web Services 
- AWS CloudFront, Gatsby, GraphQL/AWS AppSync, DynamoDB are used in Backend
- Graphql Schema has been written to define Graphql Queries and mutations
- Frontend is developed in Gatsby and deployed on AWS by using CloudFront
- For CICD, AWS Codepipeline and AWS CodeBuild is used in both frontend and backend 
- Gatsby is SSG so on creation of every new page, project needs to be re-built thus CICD is used form frontent. When ever new Page will be created, project will be auto re-build by getting project code from Github Repo and store in s3 bucket and later on used for gatsby develop
- Backend there is lambda used so for CICD, Code from github repo is stored in s3 bucket so later on used to generate node modules folder

 
