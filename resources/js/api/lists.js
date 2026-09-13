import api from "@/api/client";

export function searchLists(query) {
    return api
        .get("/lists/search", { params: { search: query } })
        .then((response) => response.data.listsToFollow);
}
