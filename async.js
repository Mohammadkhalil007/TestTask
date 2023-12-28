const {fetchData}=require('../Ikonic-Test-Tasks/tasks/asycOperations')
const {listFilesWithExtension}=require('../Ikonic-Test-Tasks/tasks/readDirectory')


const directoryPath = '../Ikonic-Test-Tasks/files';
const fileExtension = 'txt';
async function init(){
    console.log("**************** TEST TASK-1 ****************")
    await fetchData();
    console.log("**************** TEST TASK-2 ****************")
    listFilesWithExtension(directoryPath, fileExtension);
}
init()
