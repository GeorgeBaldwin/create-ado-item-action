import {createWorkItem} from "./work-item-functions";

const core = require('@actions/core');
const github = require('@actions/github');

try {
    console.log(`The Current RunID: ${github.context.runId}`)
    let tableChanges = core.getInput('table-changes');
    tableChanges = tableChanges.substring(tableChanges.indexOf("Pending migrations SQL:"))
    let dataChanges = core.getInput('data-changes');
    dataChanges = dataChanges.substring(dataChanges.indexOf("Pending migrations SQL"))
    const orgName: string = core.getInput('org-name');
    const project: string =  core.getInput('project');
    const type: string = core.getInput('type');
    const title: string = core.getInput('title');
    const pat: string = core.getInput("pat");
    const areaPath: string = core.getInput("area-path");
    const iterationPath: string = core.getInput("iteration-path");
    const urlPath: string = github.context.payload.repository.html_url;
    createWorkitem(tableChanges,dataChanges,github.context.runId.toString(),pat,orgName,project,type,title,areaPath,iterationPath,urlPath)

} catch (error:any) {
    core.setFailed(error.message);
}

async function createWorkitem(tableChanges:string, dataChanges:string, runId:string,token:string, orgName:string, project:string, type:string, title:string,areaPath:string, iterationPath:string, urlPath:string): Promise<void> {
    try {

        let formatedDescription = `<div><b>SQL Schema Changes:</b></div></dib><div>${tableChanges.replace(/%0A/g, '</div><div>')}`
        if(dataChanges.length > 0)
            formatedDescription= formatedDescription + `<b>SQL Data Changes:</b></div><div>${dataChanges.replace(/%0A/g, '</div><div>')}`
        formatedDescription = formatedDescription + `<br/><br/>To View Build To Approve, <a href='${urlPath}/actions/runs/${runId}/'> Click Here </a></div>`

        const description: string = formatedDescription;
        core.debug(`orgName: ${orgName}`);
        core.debug(`project: ${project}`);
        core.debug(`type: ${type}`);
        core.debug(`title: ${title}`);
        core.debug(`description: ${description}`);
        core.debug(`areaPath: ${areaPath}`);
        core.debug(`iterationPath: ${iterationPath}`);
        core.debug('Creating new work item...');
        const newId = await createWorkItem(token, orgName, project, {
            type,
            title,
            description,
            areaPath,
            iterationPath,
            isDBTask: true
        });
        core.info(`Created work item [${title}] with id ${newId}`);

        core.setOutput('workItemId', newId);



    } catch (error) {
        core.setFailed((error as any)?.message);
    }
}
