import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { VpcStack } from '../lib/vpc-stack'
import { StageContext } from '../common/constant'

test('VPC Stack', () => {
  const app = new cdk.App()
  const stage = 'dev'
  const context: StageContext = { sample: 'sample' }
  // WHEN
  const stack = new VpcStack(app, 'MyTestStack', { stage, context })
  // THEN
  const template = Template.fromStack(stack)
  template.resourceCountIs('AWS::EC2::VPC',1)
  template.hasResourceProperties('AWS::EC2::VPC', {
    CidrBlock: '10.0.0.0/16',
    Tags: [{ 'Key': 'Name', 'Value': 'vpc-youn-cdk-dev-sample' }]
  })
})
