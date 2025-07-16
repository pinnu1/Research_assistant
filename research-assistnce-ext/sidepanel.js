document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['research_notes'], function(result) {
        if (result.research_notes) {
            document.getElementById('notes').value = result.research_notes;
        }
    });


document.getElementById('summarizeBtn').addEventListener('click', summarizeText);


document.getElementById('saveNotesBtn').addEventListener('click', savenotes);
});



async function summarizeText() {
    try{
        const[tab]=await chrome.tabs.query({active: true, currentWindow: true});
        const[{result}]=await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: () => {
                const selection = window.getSelection();
                return selection.toString();
            }
        });
        if(!result) {
            alert('Please select some text to summarize.');
            return;
        }
        const response = await fetch('http://localhost:8080/api/research/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({content: result,operation: 'summarize'})
        });
        if(!response.ok) {
            throw new Error('Network response was not ok :${response.statusText}');
        }
        const text = await response.text();
        showResult(text.replace(/\n/g, '<br>')); // Remove HTML tags
        

    }catch (error) {
        console.error('Error summarizing text:', error.message);
    }


    
}


function showResult(content ){
    document.getElementById('result').innerHTML = `<div class='result-item'><div class='result-content'>${content}</div></div>`;

}
async function savenotes() {
    const notes = document.getElementById('notes').value;
    chrome.storage.local.set({ research_notes: notes }, function() {
        alert('Notes saved successfully!');
    });
}