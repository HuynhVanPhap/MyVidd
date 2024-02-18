const IsThumbnailEmpty = async (value, { req }) => {
    if (req.files['thumbnail'] == undefined) {
        return Promise.reject();
    }
}

export default IsThumbnailEmpty;