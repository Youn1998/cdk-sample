import * as cdk from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
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

    const createResourceName = utils.createResourceName('vpc')(consts.sysName)(props.stage)

    const vpc = new ec2.CfnVPC(this, createResourceName('sample'), {
      cidrBlock: '10.0.0.0/16'
    })

    cdk.Tags.of(vpc).add('Name', createResourceName('sample'))
  }
}
