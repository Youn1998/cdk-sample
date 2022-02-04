import * as cdk from 'aws-cdk-lib/core'
import { StageContext } from 'common/constant'

/**
 * create resource name
 * @param resourcePrefix resource prefix (e.g. cf-stack)
 * @param sysName system name
 * @param stage stage environment
 * @param uniqueStr string identify resource
 * @returns resource name
 */
export const createResourceName =
  (resourcePrefix: string) => (sysName: string) => (stage: string) => (uniqueStr: string) =>
    `${resourcePrefix}-${sysName}-${stage}-${uniqueStr}`

/**
 * get stage context from cdk.json
 * @param app cdk.App
 * @param stage stage environment
 * @returns StageContext
 */
export const getStageContext = (app: cdk.App, stage: string) => {
  const stgContext: StageContext = app.node.tryGetContext(stage.toLowerCase())
  if (stgContext === undefined) {
    throw new Error('stage情報が不正です')
  }
  return stgContext
}
