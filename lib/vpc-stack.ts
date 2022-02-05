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

  public eip1a: ec2.CfnEIP
  public eip1c: ec2.CfnEIP

  public ngw1a: ec2.CfnNatGateway
  public ngw1c: ec2.CfnNatGateway

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

    // create Elastic IP
    const createEIPName = utils.createResourceName('eip')(consts.sysName)(props.stage)
    this.eip1a = new ec2.CfnEIP(this, createEIPName('1a'), {
      domain: 'vpc',
      tags: [{ key: 'Name', value: createEIPName('1a') }]
    })
    this.eip1c = new ec2.CfnEIP(this, createEIPName('1c'), {
      domain: 'vpc',
      tags: [{ key: 'Name', value: createEIPName('1c') }]
    })

    // create NAT Gateway
    const createNGWName = utils.createResourceName('ngw')(consts.sysName)(props.stage)
    this.ngw1a = new ec2.CfnNatGateway(this, createNGWName('1a'), {
      allocationId: this.eip1a.attrAllocationId,
      subnetId: this.public1a.ref,
      tags: [{ key: 'Name', value: createNGWName('1a') }]
    })
    this.ngw1c = new ec2.CfnNatGateway(this, createNGWName('1c'), {
      allocationId: this.eip1c.attrAllocationId,
      subnetId: this.public1c.ref,
      tags: [{ key: 'Name', value: createNGWName('1c') }]
    })
  }
}

/**
 * create subnet
 * @param scope Construct
 * @param name subnet name
 * @param cidrBlock subnet cidrblock
 * @param vpc VPC
 * @param az Availability Zone
 * @returns Subnet
 */
const createSubnet = (scope: Construct, name: string, cidrBlock: string, vpc: ec2.CfnVPC, az: string) =>
  new ec2.CfnSubnet(scope, name, {
    cidrBlock: cidrBlock,
    vpcId: vpc.ref,
    availabilityZone: az,
    tags: [{ key: 'Name', value: name }]
  })
