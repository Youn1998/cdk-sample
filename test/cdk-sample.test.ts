import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { VpcStack } from '../lib/vpc-stack'
import { stage, context } from './test-constants'

test('VPC Stack', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new VpcStack(app, 'MyTestStack', { stage, context })
  // THEN
  const template = Template.fromStack(stack)
  template.resourceCountIs('AWS::EC2::VPC', 1)
  template.hasResourceProperties('AWS::EC2::VPC', {
    CidrBlock: '10.0.0.0/16',
    Tags: [{ Key: 'Name', Value: 'vpc-youn-cdk-dev-sample' }]
  })

  template.resourceCountIs('AWS::EC2::Subnet', 6)
  template.hasResourceProperties('AWS::EC2::Subnet', {
    CidrBlock: '10.0.11.0/24',
    AvailabilityZone: 'ap-northeast-1a',
    Tags: [{ Key: 'Name', Value: 'subnet-youn-cdk-dev-pub-1a' }]
  })
  template.hasResourceProperties('AWS::EC2::Subnet', {
    CidrBlock: '10.0.21.0/24',
    AvailabilityZone: 'ap-northeast-1a',
    Tags: [{ Key: 'Name', Value: 'subnet-youn-cdk-dev-app-1a' }]
  })
  template.hasResourceProperties('AWS::EC2::Subnet', {
    CidrBlock: '10.0.31.0/24',
    AvailabilityZone: 'ap-northeast-1a',
    Tags: [{ Key: 'Name', Value: 'subnet-youn-cdk-dev-db-1a' }]
  })
  template.hasResourceProperties('AWS::EC2::Subnet', {
    CidrBlock: '10.0.12.0/24',
    AvailabilityZone: 'ap-northeast-1c',
    Tags: [{ Key: 'Name', Value: 'subnet-youn-cdk-dev-pub-1c' }]
  })
  template.hasResourceProperties('AWS::EC2::Subnet', {
    CidrBlock: '10.0.22.0/24',
    AvailabilityZone: 'ap-northeast-1c',
    Tags: [{ Key: 'Name', Value: 'subnet-youn-cdk-dev-app-1c' }]
  })
  template.hasResourceProperties('AWS::EC2::Subnet', {
    CidrBlock: '10.0.32.0/24',
    AvailabilityZone: 'ap-northeast-1c',
    Tags: [{ Key: 'Name', Value: 'subnet-youn-cdk-dev-db-1c' }]
  })
})
