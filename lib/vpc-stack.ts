import * as cdk from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs'
import * as consts from '../common/constant'
import * as utils from '../common/utils'

/**
 * VpcStack Props
 */
interface Props extends cdk.StackProps {
  stage: string
  context: consts.StageContext
}

/**
 * VpcStack
 */
export class VpcStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: Props) {
    super(scope, id, props)

    const createVPCName = utils.createResourceName('vpc')(consts.sysName)(props.stage)
    const createSubnetName = utils.createResourceName('subnet')(consts.sysName)(props.stage)

    // create only VPC
    const vpc = new ec2.CfnVPC(this, createVPCName('sample'), {
      cidrBlock: '10.0.0.0/16',
      tags: [{ key:'Name',value:createVPCName('sample')}]
    })

    // create subnets
    const publicSubnet1a = createSubnet(this, createSubnetName('pub-1a'), '10.0.11.0/24', vpc, 'ap-northeast-1a')
    const publicSubnet1c = createSubnet(this, createSubnetName('pub-1c'), '10.0.12.0/24', vpc, 'ap-northeast-1c')
    const appSubnet1a = createSubnet(this, createSubnetName('app-1a'), '10.0.21.0/24', vpc, 'ap-northeast-1a')
    const appSubnet1c = createSubnet(this, createSubnetName('app-1c'), '10.0.22.0/24', vpc, 'ap-northeast-1c')
    const dbSubnet1a = createSubnet(this, createSubnetName('db-1a'), '10.0.31.0/24', vpc, 'ap-northeast-1a')
    const dbSubnet1c = createSubnet(this, createSubnetName('db-1c'), '10.0.32.0/24', vpc, 'ap-northeast-1c')
  }
}

const createSubnet = (scope: Construct, name: string, cidrBlock: string, vpc: ec2.CfnVPC, az: string) =>
  new ec2.CfnSubnet(scope, name, {
    cidrBlock: cidrBlock,
    vpcId: vpc.ref,
    availabilityZone: az,
    tags: [{ key: 'Name', value: name }]
  })
