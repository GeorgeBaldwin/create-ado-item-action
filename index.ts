import {createWorkItem} from "./work-item-functions";

const core = require('@actions/core');
const github = require('@actions/github');

try {

    let tableChanges = core.getInput('table-changes');
    let dataChanges = core.getInput('data-changes');

    console.log("updated table changes")
    console.log(tableChanges)

    console.log("data changes")
    console.log(dataChanges)
    console.log("Done")
    const token: string = core.getInput('pat-token');
    const orgName: string = core.getInput('org-name');
    const project: string =  core.getInput('project');
    const type: string = core.getInput('type');
    const title: string = core.getInput('title');
    const pat: string = core.getInput("pat");
    const areaPath: string = core.getInput("area-path");
    const iterationPath: string = core.getInput("iteration-path");
    const urlPath: string = core.getInput("url-path-build");

    console.log(`The Current RunID: ${github.context.runId}`)
    createWorkitem(tableChanges,dataChanges,github.context.runId.toString(),pat,orgName,project,type,title,areaPath,iterationPath,urlPath)

} catch (error:any) {
    core.setFailed(error.message);
}



async function createWorkitem(tableChanges:string, dataChanges:string, runId:string,token:string, orgName:string, project:string, type:string, title:string,areaPath:string, iterationPath:string, urlPath:string): Promise<void> {
    try {

        let formatedDescription = `<div>${tableChanges.replace(/\n/g, '</div><div>')}
        To View Build To Approve, <a href="${urlPath}/actions/runs/${runId}/"> Click Here </a>
        </div>`

        const description: string = formatedDescription; //core.getInput('description');

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
