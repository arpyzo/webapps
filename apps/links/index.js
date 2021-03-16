const fs = require("fs");

class Links {
    constructor(config) {
        this.linksDir = config.saveDir + "links/";
    }

    handle(request, requestData, response) {
        console.log(`App links will handle ${request.url}`);

        if (request.url == "/api/load") {
            let category = request.queryParams.get("category");
            if (!category) {
               return response.return400("Missing category parameter");
            }

            if (!this.doLinksExist(category)) {
                return response.return404();
            }

            try {
                return response.returnText(this.getLinks(category));
            } catch(error) {
                console.trace(`Error loading links: ${error}`);
                return response.return500(error);
            }
        }

        if (request.url == "/api/append") {
            try {
                var appendData = JSON.parse(requestData);
            } catch(error) {
                return response.return400(error);
            }

            if (!appendData.category || !appendData.link) {
                return response.return400("Missing or empty category and/or link parameter");
            }

            if (!this.doLinksExist(appendData.category)) {
                return response.return404();
            }

            try {
                this.appendLink(appendData.category, appendData.link);
                return response.return200();
            } catch(error) {
                console.trace(`Error appending link: ${error}`);
                return response.return500(error);
            }
        }
     
        if (request.url == "/api/remove") {
            try {
                var removeData = JSON.parse(requestData);
            } catch(error) {
                return response.return400(error);
            }

            if (!removeData.category || !removeData.link) {
                return response.return400("Missing or empty category and/or link parameter");
            }

            if (!this.doLinksExist(removeData.category)) {
                return response.return404();
            }

            try {
                this.removeLink(removeData.category, removeData.link);
                return response.return200();
            } catch(error) {
                console.trace(`Error removing link: ${error}`);
                return response.return500(error);
            }
        }
     
        response.return404();
    }

    doLinksExist(category) {
        return fs.existsSync(this.linksDir + category);
    }

    getLinks(category) {
        return fs.readFileSync(this.linksDir + category);
    }

    appendLink(category, link) {
        fs.appendFileSync(this.linksDir + category, link + "\n");
    }

    removeLink(category, link) {
        let links = fs.readFileSync(this.linksDir + category, 'utf8').split("\n");
        let newLinks = links.filter(function(line) {
            return line != link;
        });
        fs.writeFileSync(this.linksDir + category, newLinks.join("\n"));
    }
}

exports.app = Links;
