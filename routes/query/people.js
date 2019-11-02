

export const QueryQuickChange = () => {
    let output = {
        query: { _id: selected_id, attributes_user: req.user.id}, 
        respond: {attributes_user: req.user.id},
    }
    return output;
}