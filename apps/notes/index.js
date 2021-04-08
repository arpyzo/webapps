const fs = require("fs");

class Notes {
    constructor(config) {
        this.notesDir = config.saveDir + "notes/";
    }

    handle(request, response) {
        console.log(`App notes will handle ${request.url}`);

        if (/^\/[a-z0-9]*$/.test(request.url)) {
            return response.returnAsset(__dirname + "/view/index.html");
        }

        // TODO: replace getNotes with generic
        if (request.url == "/api/list") {
            return response.returnText(this.getNotes("_list"));
        }

        if (request.url == "/api/load") {
            let category = request.params.get("category");
            if (!category) {
               return response.return400("Missing category parameter");
            }

            if (!this.doNotesExist(category)) {
                return response.return404();
            }

            try {
                return response.returnText(this.getNotes(category));
            } catch(error) {
                console.trace(`Error loading notes: ${error}`);
                return response.return500(error);
            }
        }

        if (request.url == "/api/save") {
            try {
                var saveData = JSON.parse(request.data);
            } catch(error) {
                return response.return400(error);
            }

            if (!saveData.category || !saveData.notes) {
                return response.return400("Missing or empty category and/or notes");
            }

            if (!this.doNotesExist(saveData.category)) {
                return response.return404();
            }

            try {
                this.saveNotes(saveData.category, saveData.notes);
                return response.return200();
            } catch(error) {
                console.trace(`Error saving notes: ${error}`);
                return response.return500(error);
            }
        }
     
        response.return404();
    }

    doNotesExist(category) {
        return fs.existsSync(this.notesDir + category);
    }

    getNotes(category) {
        return fs.readFileSync(this.notesDir + category);
    }

    saveNotes(category, notes) {
        fs.writeFileSync(this.notesDir + category, notes);
    }
}

exports.app = Notes;
