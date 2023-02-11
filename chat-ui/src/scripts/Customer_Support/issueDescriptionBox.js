
function getIssueDescriptionBox(){
    let textArea=`<div class='text-area-wrapper'>`
  textArea+=`<textarea id="issue_description" name="issue_description" rows="4" cols="40" placeholder="provide short description here if any.."></textarea>`
  textArea+=`</div>`
  return textArea;
}


export {getIssueDescriptionBox};