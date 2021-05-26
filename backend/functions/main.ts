import createLolly from "./createLolly";
import getLollyById from "./getLollyById";
import listLollies from "./listLollies";
import Lolly from "./LollyType"

type AppsyncEvent = {
    info: {
        fieldName: string
    },
    arguments: {
        lollyId: string,
        lolly: Lolly
    }

}



exports.handler = async (event: AppsyncEvent) => {


    switch (event.info.fieldName) {
        case "createLolly":
            return await createLolly(event.arguments.lolly)
        case "getLollyById":
            return await getLollyById(event.arguments.lollyId)
        case "listLollies":
            return await listLollies()
        default:
            return null;

    }
}