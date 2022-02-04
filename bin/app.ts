#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { VpcStack } from '../lib/vpc-stack'
import * as utils from '../common/utils'
import * as consts from '../common/constant'

// entrypoint
const app = new cdk.App()
// get stage env (default: dev)
const stage: string = app.node.tryGetContext('stage') ?? 'dev'
// get stage context
const context = utils.getStageContext(app, stage)

const createResourceName = utils.createResourceName('cf-stack')(consts.sysName)(stage)

const vpcStack = new VpcStack(app, createResourceName('vpc'), {
  stage,
  context
})

// tag to stuck
cdk.Tags.of(vpcStack).add('Name', consts.sysName)
