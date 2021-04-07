// Upload
$(document).ready(function() {
    $("#upload-box").on("dragover", function(dragEvent) {
        dragEvent.preventDefault();
        dragEvent.stopPropagation();
    });

    $("#upload-box").on("drop", function(dropEvent) {
        dropEvent.preventDefault();
        dropEvent.stopPropagation();

        let file = dropEvent.originalEvent.dataTransfer.files[0];

        if (file.type != "text/csv") {
            return alert(`File type is ${file.type}\nOnly CSVs accepted`);
        }

        let matches = file.name.match(/^(\d\d_20\d\d)_(amazon|freedom|bank)/);
        if (matches) {
            uploadTransactions(file, matches[1], matches[2]);
        } else {
            alert("Unable to parse filename!");
        }
    });
});

async function uploadTransactions(file, month, account) {
    ajaxSave({
        csv: await file.text(),
        month: month,
        account: account
    });
}

// Save
function ajaxSave(object) {
console.log(object.csv);
    $.ajax({
        type: "POST",
        url: "api/upload",
        contentType: "application/json",
        data: JSON.stringify(object),
        timeout: 5000,
        //success: function() {
        //    alert("AJAX success!");
        //},
        error: function(data, status, error) {
            alert(`AJAX failure: ${status}\nError: ${error}\nResponse: ${data.responseText}`);
        }
    });
}
