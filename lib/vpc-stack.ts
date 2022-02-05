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
  public vpc: ec2.CfnVPC

  public public1a: ec2.CfnSubnet
  public public1c: ec2.CfnSubnet
  public app1a: ec2.CfnSubnet
  public app1c: ec2.CfnSubnet
  public db1a: ec2.CfnSubnet
  public db1c: ec2.CfnSubnet

  public igw: ec2.CfnInternetGateway

  constructor(scope: cdk.App, id: string, props: Props) {
    super(scope, id, props)

    const createVPCName = utils.createResourceName('vpc')(consts.sysName)(props.stage)

    // create only VPC
    this.vpc = new ec2.CfnVPC(this, createVPCName('sample'), {
      cidrBlock: '10.0.0.0/16',
      tags: [{ key: 'Name', value: createVPCName('sample') }]
    })

    const createSubnetName = utils.createResourceName('subnet')(consts.sysName)(props.stage)

    // create subnets
    this.public1a = createSubnet(this, createSubnetName('pub-1a'), '10.0.11.0/24', this.vpc, 'ap-northeast-1a')
    this.public1c = createSubnet(this, createSubnetName('pub-1c'), '10.0.12.0/24', this.vpc, 'ap-northeast-1c')
    this.app1a = createSubnet(this, createSubnetName('app-1a'), '10.0.21.0/24', this.vpc, 'ap-northeast-1a')
    this.app1c = createSubnet(this, createSubnetName('app-1c'), '10.0.22.0/24', this.vpc, 'ap-northeast-1c')
    this.db1a = createSubnet(this, createSubnetName('db-1a'), '10.0.31.0/24', this.vpc, 'ap-northeast-1a')
    this.db1c = createSubnet(this, createSubnetName('db-1c'), '10.0.32.0/24', this.vpc, 'ap-northeast-1c')

    // create internet gateway
    const createIgwName = utils.createResourceName('igw')(consts.sysName)(props.stage)
    this.igw = new ec2.CfnInternetGateway(this, createIgwName('sample'), {
      tags: [{ key: 'Name', value: createIgwName('sample') }]
    })
    new ec2.CfnVPCGatewayAttachment(this, createIgwName('attachment'), {
      vpcId: this.vpc.ref,
      internetGatewayId: this.igw.ref
    })
  }
}

const createSubnet = (scope: Construct, name: string, cidrBlock: string, vpc: ec2.CfnVPC, az: string) =>
  new ec2.CfnSubnet(scope, name, {
    cidrBlock: cidrBlock,
    vpcId: vpc.ref,
    availabilityZone: az,
    tags: [{ key: 'Name', value: name }]
  })
