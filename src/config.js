export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-2",
    BUCKET: "notes-app-uploads-syed"
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://rvmy5edie1.execute-api.us-east-2.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_jlWmQeHec",
    APP_CLIENT_ID: "3eijjolmudeb6s19kqq1u06i27",
    IDENTITY_POOL_ID: "us-east-2:702910ed-d2b7-4268-a57e-31642a9fcec0"
  }
};
